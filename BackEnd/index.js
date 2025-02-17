import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cron from "node-cron";
import rateLimit from "express-rate-limit"; // Import Rate Limiter
import mongoose from "mongoose";
import connectDB from "./utils/db.js";
import path from "path";
import { fileURLToPath } from "url";

// Import Routes
import applicationRoute from "./routes/application.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import userRoute from "./routes/user.route.js";
import recruiterRoute from "./routes/recruiter.route.js";
import verificationRoute from "./routes/verification.route.js";
import orderRoute from "./routes/order.route.js";
import revenueRoute from "./routes/revenue.route.js";
import adminStatRoute from "./routes/admin/statistic.route.js";
import adminRoute from "./routes/admin/admin.route.js";
import adminUserDataRoute from "./routes/admin/userStats.route.js";
import adminCompanyDataRoute from "./routes/admin/companyStats.route.js";
import adminRecruiterDataRoute from "./routes/admin/recruiterStats.route.js";
import adminJobDataRoute from "./routes/admin/jobStats.route.js";
import adminApplicationDataRoute from "./routes/admin/applicationStats.route.js";
import notificationRoute from "./routes/notification.route.js";

// Import Models
import { JobSubscription } from "./models/jobSubscription.model.js";
import JobReport from "./models/jobReport.model.js";
import { Contact } from "./models/contact.model.js";
import { CandidateSubscription } from "./models/candidateSubscription.model.js";

dotenv.config();
const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;

// WebSocket Server with CORS
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);

// 📌 Rate Limiting (Limits API requests per IP)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Max 100 requests per IP per window
  message: "Too many requests, please try again later.",
  headers: true,
});
app.use("/api", apiLimiter); // Apply rate limiting to all API routes

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/recruiter", recruiterRoute);
app.use("/api/v1/verification", verificationRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/revenue", revenueRoute);

// Admin routes
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/admin/stat", adminStatRoute);
app.use("/api/v1/admin/user/data", adminUserDataRoute);
app.use("/api/v1/admin/company/data", adminCompanyDataRoute);
app.use("/api/v1/admin/recruiter/data", adminRecruiterDataRoute);
app.use("/api/v1/admin/job/data", adminJobDataRoute);
app.use("/api/v1/admin/application/data", adminApplicationDataRoute);
app.use("/api/v1/notifications", notificationRoute);

app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../frontend/dist"))); // Go up one level

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// Start Server & Connect to Database
server.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server running at port ${PORT}`);

  // Function to emit the updated unseen notification count
  const emitUnseenNotificationCount = async () => {
    try {
      const unseenJobReportsCount = await JobReport.countDocuments({
        status: "unseen",
      });
      const unseenContactsCount = await Contact.countDocuments({
        status: "unseen",
      });
      const totalUnseenNotifications =
        unseenJobReportsCount + unseenContactsCount;
      io.emit("newNotificationCount", { totalUnseenNotifications });
    } catch (error) {
      console.error("Error emitting unseen notification count:", error);
    }
  };

  // Function to create and manage the JobReport change stream
  const createJobReportChangeStream = () => {
    const jobReportChangeStream = JobReport.watch();

    jobReportChangeStream.on("change", async (change) => {
      if (change.operationType === "insert") {
        await emitUnseenNotificationCount();
      }
    });

    jobReportChangeStream.on("error", (error) => {
      console.error("JobReport ChangeStream error:", error);
      jobReportChangeStream.close();
      // Reinitialize after 5 seconds
      setTimeout(createJobReportChangeStream, 5000);
    });
  };

  // Function to create and manage the Contact change stream
  const createContactChangeStream = () => {
    const contactChangeStream = Contact.watch();

    contactChangeStream.on("change", async (change) => {
      if (change.operationType === "insert") {
        await emitUnseenNotificationCount();
      }
    });

    contactChangeStream.on("error", (error) => {
      console.error("Contact ChangeStream error:", error);
      contactChangeStream.close();
      // Reinitialize after 5 seconds
      setTimeout(createContactChangeStream, 5000);
    });
  };

  // Initialize the change streams with error handling
  createJobReportChangeStream();
  createContactChangeStream();
});

// WebSocket Handling
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Cron Job to Check for Expired Plans (Runs every hour)
cron.schedule("0 * * * *", async () => {
  console.log("Running cron job: Checking expired plans...");
  try {
    const [jobSubscriptions, candidateSubscriptions] = await Promise.all([
      JobSubscription.find({ status: "Active" }),
      CandidateSubscription.find({ status: "Active" }),
    ]);

    await Promise.all([
      ...jobSubscriptions.map(async (subscription) => {
        if (await subscription.checkValidity()) {
          io.emit("planExpired", {
            companyId: subscription.company,
            type: "job",
            message: "Job plan expired, please renew.",
          });
        }
      }),
      ...candidateSubscriptions.map(async (subscription) => {
        if (await subscription.checkValidity()) {
          io.emit("planExpired", {
            companyId: subscription.company,
            type: "candidate",
            message: "Candidate data plan expired, please renew.",
          });
        }
      }),
    ]);
  } catch (error) {
    console.error("Error in subscription check:", error);
  }
});

// Graceful Shutdown for MongoDB & Server
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await mongoose.connection.close();
  console.log("MongoDB Disconnected.");
  process.exit(0);
});
