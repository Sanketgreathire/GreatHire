import mongoose from "mongoose";

// Sections rendered by the home Blog page (frontend Main_blog_page.jsx).
// Each card belongs to exactly one section; the page falls back to its
// hardcoded array for any section that returns no live rows.
export const BLOG_SECTIONS = [
  "slides", // hero slider
  "featured", // "Featured Articles" carousel
  "articles", // article grid
  "hiring-advice", // Hiring Advice cards
  "trending-topics", // Trending Topics cards
  "insights", // Resume HR & HR Insights carousel
  "interview-tips", // Interview Tips / Company Insights grid
];

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    // Full article body for post pages. Card entries only carry `excerpt`.
    content: { type: String },
    // "post" = full article (appears in sitemap), "card" = Blog-page tile.
    kind: { type: String, enum: ["post", "card"], default: "post" },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
    section: { type: String, enum: BLOG_SECTIONS, index: true },
    // "./x.webp" (resolved against frontend/public) or an absolute CDN URL.
    image: { type: String },
    // Rotation list for the card tile: every image it cycles through, cover
    // first. Kept in sync with `image` on every write (see blogAdmin.controller).
    images: { type: [String], default: [] },
    category: { type: String },
    subtitle: { type: String },
    excerpt: { type: String },
    author: { type: String },
    // Pre-formatted label shown on the tile ("December 20, 2024").
    displayDate: { type: String },
    // Tile destination; defaults to /blogs/<slug> when omitted.
    link: { type: String },
    // Original numeric id hardcoded detail routes expect (/CareerAdvice/:id,
    // /ProductDetailPage/:id, /TheFuture/:id). Keep it stable per section.
    cardId: { type: Number },
    order: { type: Number, default: 0 },
    // Rotation window: a card is live when publishAt <= now and it has not
    // passed expiresAt (null = never expires).
    publishAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Covers both the public list query and the sitemap scan.
blogSchema.index({ status: 1, kind: 1, publishAt: 1, expiresAt: 1 });

export default mongoose.model("Blog", blogSchema);
