import Blog from "../models/blog.model.js";

// A blog is live when it is published, already past publishAt, and has not
// crossed expiresAt (null/absent = never expires). This is the query that
// drives the 30-day rotation: set expiresAt and the tile drops out on its own.
const liveBlogFilter = () => {
  const now = new Date();
  return {
    status: "published",
    publishAt: { $lte: now },
    $or: [{ expiresAt: null }, { expiresAt: { $gt: now } }],
  };
};

export const getBlogs = async (req, res) => {
  try {
    const { section } = req.query;
    const filter = liveBlogFilter();
    if (section) filter.section = section;

    const blogs = await Blog.find(filter).sort({ order: 1, publishAt: -1 });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Failed to load blogs", error: error.message });
  }
};

export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      slug: req.params.slug,
      status: "published",
    });

    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Failed to load blog", error: error.message });
  }
};
