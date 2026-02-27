import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
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
import contactMessageRoute from "./routes/contactMessage.route.js";

// ================= MODELS =================
import Blog from "./models/blog.model.js";

// ================= APP SETUP =================
const app = express();
const server = http.createServer(app);

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? ["https://greathire.in", "https://www.greathire.in"]
    : ["http://localhost:5173", "http://localhost:5174"];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
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
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
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

// ================= ROUTES =================
app.use("/api/v1/user", userRoute);
app.use("/api/v1/recruiter", recruiterRoute);
app.use("/api/v1/digitalmarketer", digitalmarketerRoute);
app.use("/api/v1/verification", verificationRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/revenue", revenueRoute);
app.use("/api", contactMessageRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/admin/stat", adminStatRoute);
app.use("/api/v1/admin/user/data", adminUserDataRoute);
app.use("/api/v1/admin/company/data", adminCompanyDataRoute);
app.use("/api/v1/admin/recruiter/data", adminRecruiterDataRoute);
app.use("/api/v1/admin/job/data", adminJobDataRoute);
app.use("/api/v1/admin/application/data", adminApplicationDataRoute);
app.use("/api/v1/notifications", notificationRoute);

// ================= FRONTEND =================
app.use(express.static(path.join(__dirname, "../frontend/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

// ================= SOCKET =================
io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// ================= START SERVER =================
await connectDB();
server.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ================= SHUTDOWN =================
process.on("SIGINT", async () => {
  console.log("🛑 Shutting down...");
  await mongoose.connection.close();
  process.exit(0);
});
