import express from "express";
import { getBlogs, getBlogBySlug } from "../controllers/blog.controller.js";

const router = express.Router();

router.get("/", getBlogs);
router.get("/:slug", getBlogBySlug);

export default router;
