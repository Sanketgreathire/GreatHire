import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import cron from "node-cron";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";

import connectDB from "./utils/db.js";

// ===============================
// ROUTES
// ===============================
import blogRoute from "./routes/blog.route.js";
import applicationRoute from "./routes/application.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import userRoute from "./routes/user.route.js";
import recruiterRoute from "./routes/recruiter.route.js";
import digitalmarketerRoute from "./routes/digitalmarketer.route.js";
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
import messageRoute from "./routes/message.route.js";

// ===============================
// MODELS
// ===============================
import { JobSubscription } from "./models/jobSubscription.model.js";
import { CandidateSubscription } from "./models/candidateSubscription.model.js";
import Notification from "./models/notification.model.js";
import Blog from "./models/blog.model.js"; 

// ===============================
// SOCKET UTILS
// ===============================
import { setIO } from "./utils/socket.js";
import notificationService from "./utils/notificationService.js";

// ===============================
// APP SETUP
// ===============================
const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 8000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===============================
// SECURITY
// ===============================
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.disable("x-powered-by");

// ===============================
// MIDDLEWARE
// ===============================
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ===============================
// RATE LIMITER
// ===============================
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

// ===============================
// SOCKET.IO
// ===============================
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  },
});

setIO(io);
notificationService.setIO(io);

// ===============================
// REQUEST LOGGER
// ===============================
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

// ===============================
// ✅ PUBLIC SEO FILES
// ===============================
app.get("/sitemap.xml", async (req, res) => {
  try {
    const baseUrl = "https://www.greathire.in";

    const staticPages = [
      "/",
      "/blogs",
      "/jobs",
      "/about",
      "/contact",
    ];
  app.use(
    express.static(path.join(__dirname, "public"), {
      index: false,
    })
  );
    const blogs = await Blog.find({ status: "published" });

    res.set("Content-Type", "application/xml");

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    staticPages.forEach((page) => {
      xml += `
        <url>
          <loc>${baseUrl}${page}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>`;
    });

    blogs.forEach((blog) => {
      xml += `
        <url>
          <loc>${baseUrl}/blogs/${blog.slug}</loc>
          <lastmod>${blog.updatedAt.toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.9</priority>
        </url>`;
    });

    xml += `</urlset>`;
    res.send(xml);
  } catch (err) {
    console.error("Sitemap error:", err);
    res.status(500).send("Error generating sitemap");
  }
});

app.get("/sitemap.xml", (req, res) => {
  res.set("Content-Type", "application/xml");
  res.sendFile(path.join(__dirname, "public", "sitemap.xml"));
});

app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.sendFile(path.join(__dirname, "public", "robots.txt"));
});

// ===============================
// API ROUTES
// ===============================
app.use("/api/v1/user", userRoute);
app.use("/api/v1/recruiter", recruiterRoute);
app.use("/api/v1/digitalmarketer", digitalmarketerRoute);
app.use("/api/v1/verification", verificationRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/revenue", revenueRoute);

app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/admin/stat", adminStatRoute);
app.use("/api/v1/admin/user/data", adminUserDataRoute);
app.use("/api/v1/admin/company/data", adminCompanyDataRoute);
app.use("/api/v1/admin/recruiter/data", adminRecruiterDataRoute);
app.use("/api/v1/admin/job/data", adminJobDataRoute);
app.use("/api/v1/admin/application/data", adminApplicationDataRoute);

app.use("/api/v1/notifications", notificationRoute);
app.use("/api/v1/messages", messageRoute);

// ===============================
// FRONTEND BUILD
// ===============================
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// ===============================
// SPA FALLBACK (ALWAYS LAST)
// ===============================
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// ===============================
// SOCKET HANDLERS
// ===============================
io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  socket.on("joinUserRoom", (userId) => {
    socket.join(`user_${userId}`);
  });

  socket.on("joinAdminRoom", () => {
    socket.join("adminRoom");
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// ===============================
// SERVER START
// ===============================
server.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server running on port ${PORT}`);
});

// ===============================
// CRON JOB (PLAN EXPIRY)
// ===============================
cron.schedule("* * * * *", async () => {
  try {
    const [jobSubs, candidateSubs] = await Promise.all([
      JobSubscription.find({ status: "Active" }),
      CandidateSubscription.find({ status: "Active" }),
    ]);

    for (const sub of [...jobSubs, ...candidateSubs]) {
      if (await sub.checkValidity()) {
        const notification = new Notification({
          recipient: sub.company,
          recipientModel: "Company",
          title: "Plan Expired",
          message: "Your plan has expired. Please renew.",
          type: "system",
        });

        await notification.save();
        io.to(`user_${sub.company}`).emit("newNotification", notification);
      }
    }
  } catch (error) {
    console.error("Cron error:", error);
  }
});

// ===============================
// GRACEFUL SHUTDOWN
// ===============================
process.on("SIGINT", async () => {
  console.log("🛑 Shutting down server...");
  await mongoose.connection.close();
  process.exit(0);
});
