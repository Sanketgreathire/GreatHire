import compression from "compression";
import expressStaticGzip from "express-static-gzip";
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
import referringCandidatesRoute from "./routes/admin/referringCandidates.route.js";
import notificationRoute from "./routes/notification.route.js";
import contactMessageRoute from "./routes/contactMessage.route.js";
import emailRoute from "./routes/email.route.js";
import messageRoute from "./routes/message.route.js";
import collegeRoute from "./routes/college.route.js"; // college auth + students
import courseRoute from "./routes/course.route.js";
import otpRoute from "./routes/otp.route.js";

import sourcingRoute from "./routes/sourcing/sourcing.route.js";
import ingestionRoute from "./routes/ingestion.route.js";
import autoSourcingRoute from "./routes/autoSourcing.route.js";
import adminSourcingRoute from "./routes/admin/adminSourcing.route.js";
import jdMatchingRoute from "./jd-matching/jdMatching.route.js";
import jobMatchingRoute from "./src/modules/jobs/routes/jobMatching.routes.js";
import copilotRoute from "./src/modules/copilot/routes/copilot.routes.js";
import extensionRoute from "./src/modules/extension/routes/extension.routes.js";
import outreachRoute from "./src/modules/outreach/routes/outreach.routes.js";
import enrichmentRoute from "./src/modules/enrichment/routes/enrichment.routes.js";
import learningRoute from "./src/modules/learning/routes/learning.routes.js";
import talentGraphRoute from "./src/modules/talentGraph/routes/talentGraph.routes.js";
import discoveryRoute from "./src/modules/discovery/routes/discovery.routes.js";
import githubDiscoveryRoute from "./src/modules/discovery/routes/github.routes.js";
import portfolioDiscoveryRoute from "./src/modules/discovery/routes/portfolio.routes.js";
import resumeDiscoveryRoute from "./src/modules/discovery/routes/resume.routes.js";
import freshnessRoute from "./src/modules/freshness/routes/freshness.routes.js";
import orchestratorRoute from "./src/modules/orchestrator/routes/orchestrator.routes.js";
import talentSignalsRoute from "./src/modules/talentSignals/routes/talentSignals.routes.js";
import eventsRoute from "./src/modules/events/routes/events.routes.js";

import analyticsRoute from "./routes/analytics/analytics.route.js";

import { startPlanExpiryNotifier }  from "./scripts/planExpiryNotifier.js";

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

// ================= COMPRESSION =================
app.use(compression({ level: 6, threshold: 1024 }));

// Ensure Vary header for proper CDN caching
app.use((req, res, next) => {
  res.setHeader("Vary", "Accept-Encoding");
  next();
});

// ================= MIDDLEWARE =================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ================= RATE LIMIT =================
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => req.ip,
});
app.use("/api", apiLimiter);

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
app.use("/api/v1/admin/sourcing", adminSourcingRoute);
app.use("/api/v1/admin/referring-candidates", referringCandidatesRoute);
app.use("/api/v1/notifications", notificationRoute);
app.use("/api/v1/email", emailRoute);
app.use("/api/v1/messages", messageRoute);
app.use("/api/v1/college", collegeRoute);
app.use("/api/v1/courses", courseRoute);
app.use("/api/v1/otp", otpRoute);

app.use("/api/v1/sourcing",   sourcingRoute);
app.use("/api/v1/ingestion",  ingestionRoute);
app.use("/api/v1/auto-sourcing", autoSourcingRoute);
app.use("/api/v1/jd-matching", jdMatchingRoute);
app.use("/api/v1/jobs", jobMatchingRoute);
app.use("/api/v1/copilot", copilotRoute);
app.use("/api/extension", extensionRoute);
app.use("/api/outreach", outreachRoute);
app.use("/api/candidates", enrichmentRoute);
app.use("/api/recruiter-feedback", learningRoute);
app.use("/api/talent-graph", talentGraphRoute);
app.use("/api/discovery", discoveryRoute);
app.use("/api/discovery/github", githubDiscoveryRoute);
app.use("/api/discovery/portfolio", portfolioDiscoveryRoute);
app.use("/api/discovery/resume", resumeDiscoveryRoute);
app.use("/api/freshness", freshnessRoute);
app.use("/api/orchestrator", orchestratorRoute);
app.use("/api/talent-signals", talentSignalsRoute);
app.use("/api/events", eventsRoute);

// Serve uploaded resumes
app.use("/resumes", express.static(path.join(__dirname, "public/resumes")));

app.use("/api/v1/analytics", analyticsRoute);


// ================= FRONTEND =================
// Serve pre-compressed brotli/gzip assets with 1-year cache
app.use("/assets", expressStaticGzip(path.join(__dirname, "../frontend/dist/assets"), {
  enableBrotli: true,
  orderPreference: ["br", "gz"],
  customCompressions: [
    {
      encodingName: "br",
      fileExtension: "br",
    },
  ],
  serveStatic: {
    maxAge: 31536000,
    immutable: true,
    etag: false,
    lastModified: false,
    setHeaders: (res) => {
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    },
  },
}));

// Other public files (images, fonts, manifest etc)
app.use(express.static(path.join(__dirname, "../frontend/dist"), {
  maxAge: "1d",
  etag: true,
  lastModified: true,
  setHeaders: (res, filePath) => {
    if (filePath.endsWith(".html")) {
      res.setHeader("Cache-Control", "no-cache");
    }
  },
}));

app.get("*", (req, res) => {
  res.setHeader("Cache-Control", "no-cache");
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

import { setIO } from "./utils/socket.js";
import notificationService from "./utils/notificationService.js";
import { startMonthlyFreePlanRenewal } from "./utils/monthlyFreePlanRenewal.js";
import { startAutoRejectCron } from "./utils/autoRejectApplications.js";
import { startAutoSourcingCron } from "./sourcing/cron/autoSourcingCron.js";
import { startIngestionWorker } from "./sourcing/workers/ingestionWorker.js";
import { startEmbeddingWorker } from "./sourcing/ai/candidateEmbeddingWorker.js";
import { startJdMatchingWorker } from "./jd-matching/workers/jdMatchingWorker.js";
import { startJobMatchingWorker } from "./src/modules/jobs/workers/jobMatchingWorker.js";

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

// ================= START SERVER =================

try {
  await connectDB();

  // Start server FIRST before starting workers
  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

  // Start workers AFTER server is listening (non-blocking)
  setTimeout(() => {
    try {
      startMonthlyFreePlanRenewal();
      startAutoRejectCron();
      startAutoSourcingCron();
      startIngestionWorker().catch((e) => console.warn("⚠️ Ingestion worker:", e.message));
      startEmbeddingWorker().catch((e) => console.warn("⚠️ Embedding worker:", e.message));
      startJdMatchingWorker().catch((e) => console.warn("⚠️ JD matching worker:", e.message));
      startJobMatchingWorker().catch((e) => console.warn("⚠️ Job matching worker:", e.message));

      import("./src/modules/talentGraph/services/graphQueue.service.js")
        .then(({ startTalentGraphWorker }) => startTalentGraphWorker())
        .catch((e) => console.warn("⚠️ Talent graph worker:", e.message));

      import("./src/modules/discovery/services/discoveryQueue.service.js")
        .then(({ startDiscoveryWorker }) => startDiscoveryWorker())
        .catch((e) => console.warn("⚠️ Discovery worker:", e.message));

      import("./src/modules/discovery/services/ingestionScheduler.service.js")
        .then(({ ingestionScheduler }) => ingestionScheduler.startScheduler())
        .catch((e) => console.warn("⚠️ Discovery scheduler:", e.message));

      import("./src/modules/discovery/workers/githubDiscovery.worker.js")
        .then(({ startGitHubDiscoveryWorker }) => startGitHubDiscoveryWorker())
        .catch((e) => console.warn("⚠️ GitHub discovery worker:", e.message));

      import("./src/modules/discovery/workers/portfolioDiscovery.worker.js")
        .then(({ startPortfolioDiscoveryWorker }) => startPortfolioDiscoveryWorker())
        .catch((e) => console.warn("⚠️ Portfolio discovery worker:", e.message));

      import("./src/modules/discovery/workers/resumeDiscovery.worker.js")
        .then(({ startResumeDiscoveryWorker }) => startResumeDiscoveryWorker())
        .catch((e) => console.warn("⚠️ Resume discovery worker:", e.message));

      import("./src/modules/freshness/workers/freshness.worker.js")
        .then(({ startFreshnessWorker }) => startFreshnessWorker())
        .catch((e) => console.warn("⚠️ Freshness worker:", e.message));

      import("./src/modules/orchestrator/workers/orchestrator.worker.js")
        .then(({ startOrchestratorWorker }) => startOrchestratorWorker())
        .catch((e) => console.warn("⚠️ Orchestrator worker:", e.message));

      import("./src/modules/talentSignals/workers/talentSignal.worker.js")
        .then(({ startTalentSignalWorker }) => startTalentSignalWorker())
        .catch((e) => console.warn("⚠️ Talent signal worker:", e.message));

      import("./src/modules/streaming/services/streamingCoordinator.service.js")
        .then(({ streamingCoordinatorService }) => streamingCoordinatorService.initialize())
        .catch((e) => console.warn("⚠️ Streaming coordinator:", e.message));
    } catch (workerError) {
      console.error("⚠️ Worker initialization error:", workerError.message);
    }
  }, 1000);
} catch (error) {
  console.error("❌ Server startup failed:", error);
  process.exit(1);
}

// ================= SHUTDOWN =================
process.on("SIGINT", async () => {
  console.log("🛑 Shutting down...");
  const { stopIngestionWorker } = await import("./sourcing/workers/ingestionWorker.js");
  const { stopEmbeddingWorker } = await import("./sourcing/ai/candidateEmbeddingWorker.js");
  await stopIngestionWorker();
  await stopEmbeddingWorker();
  const { stopJdMatchingWorker } = await import("./jd-matching/workers/jdMatchingWorker.js");
  await stopJdMatchingWorker();
  const { stopJobMatchingWorker } = await import("./src/modules/jobs/workers/jobMatchingWorker.js");
  await stopJobMatchingWorker();
  const { stopDiscoveryWorker } = await import("./src/modules/discovery/services/discoveryQueue.service.js");
  await stopDiscoveryWorker();
  const { stopGitHubDiscoveryWorker } = await import("./src/modules/discovery/workers/githubDiscovery.worker.js");
  await stopGitHubDiscoveryWorker();
  const { stopPortfolioDiscoveryWorker } = await import("./src/modules/discovery/workers/portfolioDiscovery.worker.js");
  await stopPortfolioDiscoveryWorker();
  const { stopResumeDiscoveryWorker } = await import("./src/modules/discovery/workers/resumeDiscovery.worker.js");
  await stopResumeDiscoveryWorker();
  const { stopFreshnessWorker } = await import("./src/modules/freshness/workers/freshness.worker.js");
  await stopFreshnessWorker();
  const { stopOrchestratorWorker } = await import("./src/modules/orchestrator/workers/orchestrator.worker.js");
  await stopOrchestratorWorker();
  const { stopTalentSignalWorker } = await import("./src/modules/talentSignals/workers/talentSignal.worker.js");
  await stopTalentSignalWorker();
  const { streamingCoordinatorService } = await import("./src/modules/streaming/services/streamingCoordinator.service.js");
  await streamingCoordinatorService.shutdown();
  await mongoose.connection.close();
  process.exit(0);
});
