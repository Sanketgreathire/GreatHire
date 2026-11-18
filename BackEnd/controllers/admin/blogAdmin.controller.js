import Blog from "../../models/blog.model.js";
import cloudinary from "../../utils/cloudinary.js";

// Fields an admin may write. Anything else in the payload is ignored.
const EDITABLE_FIELDS = [
  "title",
  "slug",
  "content",
  "kind",
  "status",
  "section",
  "image",
  "images",
  "category",
  "subtitle",
  "excerpt",
  "author",
  "displayDate",
  "link",
  "cardId",
  "order",
  "publishAt",
  "expiresAt",
];

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

// Normalise form payloads: empty strings would fail Date/Number casting.
const sanitizeBody = (body) => {
  const out = {};
  for (const key of EDITABLE_FIELDS) {
    if (body[key] === undefined) continue;
    let value = body[key];
    if (typeof value === "string") value = value.trim();
    if (key === "publishAt" || key === "expiresAt") {
      // Blank publishAt = leave unchanged (schema default applies on create);
      // a null publishAt would fail the public $lte window query and silently
      // hide the card. Blank expiresAt explicitly clears the expiry.
      if (value === "" || value == null) {
        if (key === "expiresAt") out[key] = null;
        continue;
      }
      out[key] = value;
      continue;
    }
    if (key === "cardId" || key === "order") {
      if (value === "" || value == null) continue;
      out[key] = Number(value);
      if (Number.isNaN(out[key])) continue;
      continue;
    }
    if (key === "images") {
      // Rotation list: accept an array (or comma string), drop blanks, cap at 8.
      const arr = Array.isArray(value)
        ? value
        : typeof value === "string" && value
          ? value.split(",")
          : [];
      out.images = arr.map((s) => String(s).trim()).filter(Boolean).slice(0, 8);
      continue;
    }
    out[key] = value;
  }
  // Keep `image` (the cover) in sync with the rotation list: first wins.
  // A payload that only carries `image` (raw/legacy clients) syncs the other way.
  if (Object.prototype.hasOwnProperty.call(out, "images")) {
    out.image = out.images.length ? out.images[0] : "";
  } else if (typeof out.image === "string") {
    out.images = out.image ? [out.image] : [];
  }
  return out;
};

// GET /api/v1/admin/blogs — everything, drafts included, for the admin table.
export const listBlogs = async (req, res) => {
  try {
    const { section, status, kind } = req.query;
    const filter = {};
    if (section) filter.section = section;
    if (status) filter.status = status;
    if (kind) filter.kind = kind;

    const blogs = await Blog.find(filter).sort({
      section: 1,
      order: 1,
      createdAt: -1,
    });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Failed to load blogs", error: error.message });
  }
};

// POST /api/v1/admin/blogs
export const createBlog = async (req, res) => {
  try {
    const body = sanitizeBody(req.body);

    if (!body.title) return res.status(400).json({ message: "Title is required" });
    if (!body.section) return res.status(400).json({ message: "Section is required" });

    body.slug = body.slug
      ? slugify(body.slug)
      : `${body.section}-${slugify(body.title)}`;
    body.kind = body.kind || "card";

    const exists = await Blog.findOne({ slug: body.slug });
    if (exists) {
      return res.status(409).json({ message: "A blog with this slug already exists" });
    }

    const blog = await Blog.create(body);
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Failed to create blog", error: error.message });
  }
};

// PUT /api/v1/admin/blogs/:id
export const updateBlog = async (req, res) => {
  try {
    const body = sanitizeBody(req.body);

    if (body.slug) {
      body.slug = slugify(body.slug);
      const clash = await Blog.findOne({ slug: body.slug, _id: { $ne: req.params.id } });
      if (clash) {
        return res.status(409).json({ message: "A blog with this slug already exists" });
      }
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, body, {
      returnDocument: "after",
      runValidators: true,
    });
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: "Failed to update blog", error: error.message });
  }
};

// DELETE /api/v1/admin/blogs/:id
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json({ message: "Blog deleted", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete blog", error: error.message });
  }
};

// POST /api/v1/admin/blogs/upload-image  (multipart field: "image")
// Returns { url } — the Cloudinary secure_url stored on the card.
export const uploadBlogImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image provided" });
    }

    const url = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "greathire/blog_images" },
        (error, result) => (error ? reject(error) : resolve(result.secure_url))
      );
      stream.end(req.file.buffer);
    });

    res.status(201).json({ url });
  } catch (error) {
    res.status(500).json({ message: "Image upload failed", error: error.message });
  }
};

// POST /api/v1/admin/blogs/upload-images  (multipart field: "images", ≤8 files)
// Returns { urls } — the rotation list for a card (cover first).
export const uploadBlogImages = async (req, res) => {
  try {
    if (!req.files?.length) {
      return res.status(400).json({ message: "No images provided" });
    }

    const urls = await Promise.all(
      req.files.map(
        (file) =>
          new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              { folder: "greathire/blog_images" },
              (error, result) => (error ? reject(error) : resolve(result.secure_url))
            );
            stream.end(file.buffer);
          })
      )
    );

    res.status(201).json({ urls });
  } catch (error) {
    res.status(500).json({ message: "Image upload failed", error: error.message });
  }
};
