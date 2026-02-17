
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
import http from "http";
import { Server } from "socket.io";

import connectDB from "./utils/db.js";

// ================= ROUTES =================
import applicationRoute from "./routes/application.route.js";
import companyRoute from "./routes/company.route.js";
import jobRoute from "./routes/job.route.js";
import userRoute from "./routes/user.route.js";
import recruiterRoute from "./routes/recruiter.route.js";
import digitalmarketerRoute from "./routes/digitalmarketer.route.js";
import verificationRoute from "./routes/verification.route.js";
import orderRoute from "./routes/order.route.js";
import revenueRoute from "./routes/revenue.route.js";
import adminRoute from "./routes/admin/admin.route.js";
import adminStatRoute from "./routes/admin/statistic.route.js";
import adminUserDataRoute from "./routes/admin/userStats.route.js";
import adminCompanyDataRoute from "./routes/admin/companyStats.route.js";
import adminRecruiterDataRoute from "./routes/admin/recruiterStats.route.js";
import adminJobDataRoute from "./routes/admin/jobStats.route.js";
import adminApplicationDataRoute from "./routes/admin/applicationStats.route.js";
import notificationRoute from "./routes/notification.route.js";
import contactMessageRoute from "./routes/contactMessage.route.js"; // NEW ROUTE

// ================= MODELS =================
import Blog from "./models/blog.model.js";
import { JobSubscription } from "./models/jobSubscription.model.js";
import { CandidateSubscription } from "./models/candidateSubscription.model.js";

// ================= APP SETUP =================
const app = express();
const server = http.createServer(app);

const defaultProductionOrigins = [
  "https://greathire.in",
  "https://www.greathire.in",
];

const configuredOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  : [];

const productionOrigins = [
  ...new Set([...defaultProductionOrigins, ...configuredOrigins]),
];

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? productionOrigins
    : ["http://localhost:5173", "http://localhost:5174"];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

const io = new Server(server, {
  cors: corsOptions,
});

const PORT = process.env.PORT || 8000;
app.set("trust proxy", 1);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ================= SECURITY =================
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
app.disable("x-powered-by");

// ================= CORS =================
app.use(
<<<<<<< HEAD
  cors(corsOptions)
=======
  cors({
    origin:
       process.env.NODE_ENV === "production"
        ? ["https://greathire.in"]
        : ["http://localhost:5173", "http://localhost:5174"],
    credentials: true,
  })
8abefd7a (Minor bug fixes)
);

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ================= RATE LIMIT =================
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
});
app.use("/api", apiLimiter);

// ================= LOGGER =================
app.use((req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  next();
});

// ================= SEO FILES =================
app.get("/sitemap.xml", async (req, res) => {
  try {
    const baseUrl = "https://www.greathire.in";
    const staticPages = ["/", "/jobs", "/blogs", "/about", "/contact"];
    const blogs = await Blog.find({ status: "published" }).select(
      "slug updatedAt"
    );

    res.set("Content-Type", "application/xml");

    let xml = `<?xml version="1.0" encoding="UTF-8"?>`;
    xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

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

app.get("/robots.txt", (req, res) => {
  res.type("text/plain");
  res.send(`User-agent: *
Allow: /

Sitemap: https://www.greathire.in/sitemap.xml`);
});

// ================= API ROUTES =================
app.use("/api/v1/user", userRoute);
app.use("/api/v1/recruiter", recruiterRoute);
app.use("/api/v1/digitalmarketer", digitalmarketerRoute);
app.use("/api/v1/verification", verificationRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/revenue", revenueRoute);
app.use("/api", contactMessageRoute); // NEW ROUTE - Handles /api/sendMessage

app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/admin/stat", adminStatRoute);
app.use("/api/v1/admin/user/data", adminUserDataRoute);
app.use("/api/v1/admin/company/data", adminCompanyDataRoute);
app.use("/api/v1/admin/recruiter/data", adminRecruiterDataRoute);
app.use("/api/v1/admin/job/data", adminJobDataRoute);
app.use(
  "/api/v1/admin/application/data",
  adminApplicationDataRoute
);

app.use("/api/v1/notifications", notificationRoute);

// ================= FRONTEND =================
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// ================= SPA FALLBACK =================
app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../frontend/dist/index.html")
  );
});

import { setIO } from "./utils/socket.js";
import notificationService from "./utils/notificationService.js";
import { startMonthlyFreePlanRenewal } from "./utils/monthlyFreePlanRenewal.js";

// ================= SOCKET =================
io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);
  
  // User joins their personal room for notifications
  socket.on("join", (userId) => {
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      socket.join(`user_${userId}`);
      console.log(`👤 User ${userId} joined room: user_${userId}`);
    } else {
      console.warn(`⚠️ Invalid userId provided for join: ${userId}`);
    }
  });
  
  // Handle user leaving room
  socket.on("leave", (userId) => {
    if (userId && mongoose.Types.ObjectId.isValid(userId)) {
      socket.leave(`user_${userId}`);
      console.log(`👋 User ${userId} left room: user_${userId}`);
    } else {
      console.warn(`⚠️ Invalid userId provided for leave: ${userId}`);
    }
  });
  
  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// Initialize Socket.IO for notification service
setIO(io);
notificationService.setIO(io);

// ================= CRON =================
// DISABLED TEMPORARILY - Will be enabled after proper deployment
// PRODUCTION: Check plan expiry daily at midnight
/*
cron.schedule("0 0 * * *", async () => {
  try {
    console.log("⏰ Checking plan expiry...");
    
    const jobSubs = await JobSubscription.find({ status: { $in: ["Active", "Hold"] } });
    console.log(`📊 Found ${jobSubs.length} job subscriptions`);

    const now = new Date();
    const oneMonthFromNow = new Date();
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

    for (const sub of jobSubs) {
      if (!sub.expiryDate) {
        console.log(`⚠️ Setting expiry for old subscription ${sub._id} to 1 month from now`);
        await JobSubscription.updateOne(
          { _id: sub._id },
          { $set: { expiryDate: oneMonthFromNow, status: "Active" } }
        );
        sub.expiryDate = oneMonthFromNow;
        sub.status = "Active";
      }
    }

    const activeSubs = jobSubs.filter(s => s.status === "Active");
    console.log(`🔍 Checking ${activeSubs.length} active subscriptions for expiry`);

    for (const sub of activeSubs) {
      try {
        if (sub.checkValidity && typeof sub.checkValidity === 'function') {
          if (await sub.checkValidity()) {
            console.log(`❌ Plan expired for company: ${sub.company}`);
            io.emit("planExpired", { companyId: sub.company, message: "Plan expired. Please renew." });
          }
        } else {
          console.warn(`⚠️ Subscription ${sub._id} does not have checkValidity method`);
        }
      } catch (subError) {
        console.error(`❌ Error checking validity for subscription ${sub._id}:`, subError.message);
      }
    }
  } catch (err) {
    console.error("Cron error:", err);
  }
});
*/
console.log("⚠️ Plan expiry cron is temporarily disabled");

// ================= START SERVER (FIXED) =================
await connectDB();

// Start monthly free plan renewal cron job
startMonthlyFreePlanRenewal();

server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ================= SHUTDOWN =================
process.on("SIGINT", async () => {
  console.log("🛑 Shutting down...");
  await mongoose.connection.close();
  process.exit(0);
});

