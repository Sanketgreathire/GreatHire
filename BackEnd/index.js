
// import dotenv from "dotenv";
// dotenv.config();
// import cookieParser from "cookie-parser";
// import cors from "cors";
// import express from "express";
// import { createServer } from "http";
// import { Server } from "socket.io";
// import cron from "node-cron";
// import rateLimit from "express-rate-limit";
// import mongoose from "mongoose";
// import connectDB from "./utils/db.js";
// import path from "path";
// import { fileURLToPath } from "url";
// import helmet from "helmet";
// import jobRoutes from "./routes/job.route.js";


// // Import Routes
// import applicationRoute from "./routes/application.route.js";
// import companyRoute from "./routes/company.route.js";
// // import jobRoute from "./routes/job.route.js";
// import userRoute from "./routes/user.route.js";
// import recruiterRoute from "./routes/recruiter.route.js";
// import digitalmarketerRoute from "./routes/digitalmarketer.route.js";
// import verificationRoute from "./routes/verification.route.js";
// import orderRoute from "./routes/order.route.js";
// import revenueRoute from "./routes/revenue.route.js";
// import adminStatRoute from "./routes/admin/statistic.route.js";
// import adminRoute from "./routes/admin/admin.route.js";
// import adminUserDataRoute from "./routes/admin/userStats.route.js";
// import adminCompanyDataRoute from "./routes/admin/companyStats.route.js";
// import adminRecruiterDataRoute from "./routes/admin/recruiterStats.route.js";
// import adminJobDataRoute from "./routes/admin/jobStats.route.js";
// import adminApplicationDataRoute from "./routes/admin/applicationStats.route.js";
// import notificationRoute from "./routes/notification.route.js";
// import messageRoute from "./routes/message.route.js";

// // Import Models
// import { JobSubscription } from "./models/jobSubscription.model.js";
// import JobReport from "./models/jobReport.model.js";
// import { Contact } from "./models/contact.model.js";
// import { CandidateSubscription } from "./models/candidateSubscription.model.js";
// import Notification  from "./models/notification.model.js";

// // Import socket utility
// import { setIO } from "./utils/socket.js";
// import notificationService from "./utils/notificationService.js";


// const app = express();
// const server = createServer(app);
// const PORT = process.env.PORT || 8000;

// // Security Middleware
// app.use(helmet({
//   contentSecurityPolicy: false,
// }));
// app.disable("x-powered-by");

// // WebSocket Server with CORS
// const io = new Server(server, {
//   cors: {
//     origin: ["http://localhost:5173", "http://localhost:5174"],
//     credentials: true,
//   },
// });

// // Set the io instance in the socket utility
// setIO(io);
// notificationService.setIO(io);

// // Middleware
// app.use(
//   cors({
//     origin: ["http://localhost:5173", "http://localhost:5174"],
//     credentials: true,
//   })
// );
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use("/socket.io/", (req, res, next) => next());

// // Rate Limiting
// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000,
//   max: 200,
//   message: "Too many requests, please try again later.",
//   headers: true,
// });
// app.use("/api", apiLimiter);

// app.use("/api/v1/job", jobRoutes);

// // API Routes
// app.use("/api/v1/user", userRoute);
// app.use("/api/v1/recruiter", recruiterRoute);
// app.use("/api/v1/digitalmarketer", digitalmarketerRoute);
// app.use("/api/v1/verification", verificationRoute);
// app.use("/api/v1/company", companyRoute);
// // app.use("/api/v1/job", jobRoute);
// app.use("/api/v1/application", applicationRoute);
// app.use("/api/v1/order", orderRoute);
// app.use("/api/v1/revenue", revenueRoute);

// // Admin routes
// app.use("/api/v1/admin", adminRoute);
// app.use("/api/v1/admin/stat", adminStatRoute);
// app.use("/api/v1/admin/user/data", adminUserDataRoute);
// app.use("/api/v1/admin/company/data", adminCompanyDataRoute);
// app.use("/api/v1/admin/recruiter/data", adminRecruiterDataRoute);
// app.use("/api/v1/admin/job/data", adminJobDataRoute);
// app.use("/api/v1/admin/application/data", adminApplicationDataRoute);
// app.use("/api/v1/notifications", notificationRoute);
// app.use("/api/v1/messages", messageRoute);

// // Request logging
// app.use((req, res, next) => {
//   console.log(`Incoming request: ${req.method} ${req.url}`);
//   next();
// });

// // Static files and SPA fallback
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// app.use(express.static(path.join(__dirname, "../frontend/dist")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
// });

// // WebSocket Handling
// io.on("connection", (socket) => {
//   console.log(`New client connected: ${socket.id}`);

//   // Handle joining user-specific rooms
//   socket.on("joinUserRoom", (userId) => {
//     socket.join(`user_${userId}`);
//     console.log(`User ${userId} joined their notification room`);
//   });

//   // Handle joining admin room
//   socket.on("joinAdminRoom", () => {
//     socket.join("adminRoom");
//     console.log(`Admin joined notification room`);
//   });

//   socket.on("disconnect", () => {
//     console.log(`Client disconnected: ${socket.id}`);
//   });
// });

// // Start Server & Connect to Database
// server.listen(PORT, async () => {
//   await connectDB();
//   console.log(`🚀 Server running at port ${PORT}`);

//   // Notification count emitter
//   const emitUnseenNotificationCount = async () => {
//     try {
//       const [unseenJobReportsCount, unseenContactsCount, adminNotificationCount] = await Promise.all([
//         JobReport.countDocuments({ status: "unseen" }),
//         Contact.countDocuments({ status: "unseen" }),
//         Notification.countDocuments({ recipientModel: 'Admin', isRead: false })
//       ]);
      
//       const totalUnseenNotifications = 
//         unseenJobReportsCount + unseenContactsCount + adminNotificationCount;
        
//       io.emit("newNotificationCount", { totalUnseenNotifications });
//     } catch (error) {
//       console.error("Error emitting unseen notification count:", error);
//     }
//   };

//   // Change stream handlers
//   const setupChangeStream = (model, errorMsg) => {
//     const changeStream = model.watch();
    
//     changeStream.on("change", async (change) => {
//       if (change.operationType === "insert") {
//         await emitUnseenNotificationCount();
//       }
//     });

//     changeStream.on("error", (error) => {
//       console.error(`${errorMsg}:`, error);
//       changeStream.close();
//       setTimeout(() => setupChangeStream(model, errorMsg), 5000);
//     });
//   };

//   // Initialize change streams
//   setupChangeStream(JobReport, "JobReport ChangeStream error");
//   setupChangeStream(Contact, "Contact ChangeStream error");
  
//   // Also set up for Notification model
//   const notificationChangeStream = Notification.watch();
//   notificationChangeStream.on("change", async (change) => {
//     if (change.operationType === "insert") {
//       await emitUnseenNotificationCount();
//     }
//   });
// });

// // Cron Job to Check for Expired Plans
// cron.schedule("* * * * *", async () => {
//   console.log("Running cron job: Checking expired plans...");
//   try {
//     const [jobSubscriptions, candidateSubscriptions] = await Promise.all([
//       JobSubscription.find({ status: "Active" }),
//       CandidateSubscription.find({ status: "Active" }),
//     ]);

//     await Promise.all([
//       ...jobSubscriptions.map(async (subscription) => {
//         if (await subscription.checkValidity()) {
//           // Create notification
//           const notification = new Notification({
//             recipient: subscription.company,
//             recipientModel: 'Company',
//             title: 'Plan Expired',
//             message: 'Your job plan has expired. Please renew to continue posting jobs.',
//             type: 'system',
//             metadata: { subscriptionId: subscription._id, type: 'job' }
//           });
//           await notification.save();
          
//           // Emit to company
//           io.to(`user_${subscription.company}`).emit('newNotification', notification);
//         }
//       }),
//       ...candidateSubscriptions.map(async (subscription) => {
//         if (await subscription.checkValidity()) {
//           // Create notification
//           const notification = new Notification({
//             recipient: subscription.company,
//             recipientModel: 'Company',
//             title: 'Plan Expired',
//             message: 'Your candidate data plan has expired. Please renew to access candidate database.',
//             type: 'system',
//             metadata: { subscriptionId: subscription._id, type: 'candidate' }
//           });
//           await notification.save();
          
//           // Emit to company
//           io.to(`user_${subscription.company}`).emit('newNotification', notification);
//         }
//       }),
//     ]);
//   } catch (error) {
//     console.error("Error in subscription check:", error);
//   }
// });

// // Graceful Shutdown
// process.on("SIGINT", async () => {
//   console.log("Shutting down server...");
//   await mongoose.connection.close();
//   console.log("MongoDB Disconnected.");
//   process.exit(0);
// });

// // Helper function to emit notifications
// export const emitNotification = (recipientId, notificationData) => {
//   io.to(`user_${recipientId}`).emit('newNotification', notificationData);
// };








import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cron from "node-cron";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import connectDB from "./utils/db.js";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";


// Import Routes
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

// Import Models
import { JobSubscription } from "./models/jobSubscription.model.js";
import JobReport from "./models/jobReport.model.js";
import { Contact } from "./models/contact.model.js";
import { CandidateSubscription } from "./models/candidateSubscription.model.js";
import Notification  from "./models/notification.model.js";

// Import socket utility
import { setIO } from "./utils/socket.js";
import notificationService from "./utils/notificationService.js";

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 8000;

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.disable("x-powered-by");

// WebSocket Server with CORS
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  },
});

// Set the io instance in the socket utility
setIO(io);
notificationService.setIO(io);

// Middleware
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/socket.io/", (req, res, next) => next());

// Rate Limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: "Too many requests, please try again later.",
  headers: true,
});
app.use("/api", apiLimiter);

// API Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/recruiter", recruiterRoute);
app.use("/api/v1/digitalmarketer", digitalmarketerRoute);
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
app.use("/api/v1/messages", messageRoute);

// Request logging
app.use((req, res, next) => {
  console.log(`Incoming request: ${req.method} ${req.url}`);
  next();
});

// Static files and SPA fallback
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// WebSocket Handling
io.on("connection", (socket) => {
  console.log(`New client connected: ${socket.id}`);

  // Handle joining user-specific rooms
  socket.on("joinUserRoom", (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their notification room`);
  });

  // Handle joining admin room
  socket.on("joinAdminRoom", () => {
    socket.join("adminRoom");
    console.log(`Admin joined notification room`);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

// Start Server & Connect to Database
server.listen(PORT, async () => {
  await connectDB();
  console.log(`🚀 Server running at port ${PORT}`);

  // Notification count emitter
  const emitUnseenNotificationCount = async () => {
    try {
      const [unseenJobReportsCount, unseenContactsCount, adminNotificationCount] = await Promise.all([
        JobReport.countDocuments({ status: "unseen" }),
        Contact.countDocuments({ status: "unseen" }),
        Notification.countDocuments({ recipientModel: 'Admin', isRead: false })
      ]);
      
      const totalUnseenNotifications = 
        unseenJobReportsCount + unseenContactsCount + adminNotificationCount;
        
      io.emit("newNotificationCount", { totalUnseenNotifications });
    } catch (error) {
      console.error("Error emitting unseen notification count:", error);
    }
  };

  // Change stream handlers
  const setupChangeStream = (model, errorMsg) => {
    const changeStream = model.watch();
    
    changeStream.on("change", async (change) => {
      if (change.operationType === "insert") {
        await emitUnseenNotificationCount();
      }
    });

    changeStream.on("error", (error) => {
      console.error(`${errorMsg}:`, error);
      changeStream.close();
      setTimeout(() => setupChangeStream(model, errorMsg), 5000);
    });
  };

  // Initialize change streams
  setupChangeStream(JobReport, "JobReport ChangeStream error");
  setupChangeStream(Contact, "Contact ChangeStream error");
  
  // Also set up for Notification model
  const notificationChangeStream = Notification.watch();
  notificationChangeStream.on("change", async (change) => {
    if (change.operationType === "insert") {
      await emitUnseenNotificationCount();
    }
  });
});

// Cron Job to Check for Expired Plans
cron.schedule("* * * * *", async () => {
  console.log("Running cron job: Checking expired plans...");
  try {
    const [jobSubscriptions, candidateSubscriptions] = await Promise.all([
      JobSubscription.find({ status: "Active" }),
      CandidateSubscription.find({ status: "Active" }),
    ]);

    await Promise.all([
      ...jobSubscriptions.map(async (subscription) => {
        if (await subscription.checkValidity()) {
          // Create notification
          const notification = new Notification({
            recipient: subscription.company,
            recipientModel: 'Company',
            title: 'Plan Expired',
            message: 'Your job plan has expired. Please renew to continue posting jobs.',
            type: 'system',
            metadata: { subscriptionId: subscription._id, type: 'job' }
          });
          await notification.save();
          
          // Emit to company
          io.to(`user_${subscription.company}`).emit('newNotification', notification);
        }
      }),
      ...candidateSubscriptions.map(async (subscription) => {
        if (await subscription.checkValidity()) {
          // Create notification
          const notification = new Notification({
            recipient: subscription.company,
            recipientModel: 'Company',
            title: 'Plan Expired',
            message: 'Your candidate data plan has expired. Please renew to access candidate database.',
            type: 'system',
            metadata: { subscriptionId: subscription._id, type: 'candidate' }
          });
          await notification.save();
          
          // Emit to company
          io.to(`user_${subscription.company}`).emit('newNotification', notification);
        }
      }),
    ]);
  } catch (error) {
    console.error("Error in subscription check:", error);
  }
});

// Graceful Shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down server...");
  await mongoose.connection.close();
  console.log("MongoDB Disconnected.");
  process.exit(0);
});

// Helper function to emit notifications
export const emitNotification = (recipientId, notificationData) => {
  io.to(`user_${recipientId}`).emit('newNotification', notificationData);
};