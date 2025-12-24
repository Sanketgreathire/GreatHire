import Blog from "../models/blog.model.js";

export const getBlogs = async (req, res) => {
  const blogs = await Blog.find({ status: "published" }).sort({ createdAt: -1 });
  res.json(blogs);
};

export const getBlogBySlug = async (req, res) => {
  const blog = await Blog.findOne({
    slug: req.params.slug,
    status: "published",
  });

  if (!blog) return res.status(404).json({ message: "Blog not found" });

  res.json(blog);
};
