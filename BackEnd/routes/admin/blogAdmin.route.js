import express from "express";
import isAuthenticated from "../../middlewares/isAuthenticated.js";
import isAdmin from "../../middlewares/isAdmin.js";
import {
  listBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  uploadBlogImage,
  uploadBlogImages,
} from "../../controllers/admin/blogAdmin.controller.js";
import { blogImageUpload, blogImagesUpload } from "../../middlewares/multer.js";

const router = express.Router();

// Admin-only: any authenticated non-admin gets 403 (see middlewares/isAdmin.js).
router.use(isAuthenticated, isAdmin);

router.get("/", listBlogs);
router.post("/", createBlog);
router.put("/:id", updateBlog);
router.delete("/:id", deleteBlog);
router.post("/upload-image", blogImageUpload, uploadBlogImage);
router.post("/upload-images", blogImagesUpload, uploadBlogImages);

export default router;
