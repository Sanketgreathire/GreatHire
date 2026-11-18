import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { toast } from "react-hot-toast";
import Navbar from "@/components/admin/Navbar";
import DeleteConfirmation from "@/components/shared/DeleteConfirmation";
import API from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Pencil,
  Trash2,
  Upload,
  Loader2,
  X,
  Search,
} from "lucide-react";

// Must match BLOG_SECTIONS in BackEnd/models/blog.model.js
const SECTIONS = [
  { value: "slides", label: "Hero Slider" },
  { value: "featured", label: "Featured Articles" },
  { value: "articles", label: "Articles" },
  { value: "hiring-advice", label: "Hiring Advice" },
  { value: "trending-topics", label: "Trending Topics" },
  { value: "insights", label: "Resume HR & HR Insights" },
  { value: "interview-tips", label: "Interview Tips & Company Insights" },
];

const STATUSES = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

const KINDS = [
  { value: "card", label: "Card (Blog page tile)" },
  { value: "post", label: "Post (full article)" },
];

const EMPTY_FORM = {
  title: "",
  slug: "",
  section: "articles",
  status: "published",
  kind: "card",
  image: "",
  images: [],
  category: "",
  subtitle: "",
  excerpt: "",
  content: "",
  author: "",
  displayDate: "",
  link: "",
  cardId: "",
  order: "",
  publishAt: "",
  expiresAt: "",
};

const inputCls =
  "w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400";

const toDateInput = (value) =>
  value ? new Date(value).toISOString().slice(0, 10) : "";

// "./x.webp" -> "/x.webp" so previews resolve against the app origin
const displaySrc = (value) =>
  value && value.startsWith("./") ? `/${value.slice(2)}` : value;

const Field = ({ label, children, wide = false }) => (
  <div className={wide ? "sm:col-span-2" : ""}>
    <Label className="mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400">
      {label}
    </Label>
    {children}
  </div>
);

Field.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  wide: PropTypes.bool,
};

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [urlDraft, setUrlDraft] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [sectionFilter, setSectionFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/v1/admin/blogs");
      setBlogs(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load blogs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const openCreate = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setUrlDraft("");
    setModalOpen(true);
  };

  const openEdit = (blog) => {
    setEditingId(blog._id);
    setUrlDraft("");
    setForm({
      title: blog.title || "",
      slug: blog.slug || "",
      section: blog.section || "articles",
      status: blog.status || "published",
      kind: blog.kind || "card",
      image: blog.image || "",
      images: Array.isArray(blog.images) && blog.images.length
        ? blog.images
        : blog.image
          ? [blog.image]
          : [],
      category: blog.category || "",
      subtitle: blog.subtitle || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      author: blog.author || "",
      displayDate: blog.displayDate || "",
      link: blog.link || "",
      cardId: blog.cardId ?? "",
      order: blog.order ?? "",
      publishAt: toDateInput(blog.publishAt),
      expiresAt: toDateInput(blog.expiresAt),
    });
    setModalOpen(true);
  };

  const save = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) return toast.error("Title is required.");
    if (!form.section) return toast.error("Section is required.");

    setSaving(true);
    try {
      // image = cover = first of the rotation list (server re-syncs too).
      const images = (form.images || []).filter(Boolean);
      const payload = { ...form, images, image: images[0] || "" };
      if (editingId) {
        await API.put(`/v1/admin/blogs/${editingId}`, payload);
        toast.success("Blog updated.");
      } else {
        await API.post("/v1/admin/blogs", payload);
        toast.success("Blog created.");
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save blog.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget || deleting) return;
    setDeleting(true);
    try {
      await API.delete(`/v1/admin/blogs/${deleteTarget._id}`);
      toast.success("Blog deleted.");
      setDeleteTarget(null);
      await load();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete blog.");
    } finally {
      setDeleting(false);
    }
  };

  const onImageFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";
    if (!files.length) return;

    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    for (const file of files) {
      if (!allowed.includes(file.type)) {
        return toast.error("Only JPG, PNG or WEBP images are allowed.");
      }
      if (file.size > 10 * 1024 * 1024) {
        return toast.error("Image must be 10 MB or smaller.");
      }
    }

    const room = 8 - (form.images?.length || 0);
    if (room <= 0) {
      return toast.error("A card can have at most 8 images.");
    }
    const batch = files.slice(0, room);
    if (batch.length < files.length) {
      toast("Only the first 8 images are kept.");
    }

    const fd = new FormData();
    batch.forEach((file) => fd.append("images", file));
    setUploading(true);
    try {
      const res = await API.post("/v1/admin/blogs/upload-images", fd);
      const urls = Array.isArray(res.data.urls) ? res.data.urls : [];
      setForm((prev) => ({ ...prev, images: [...(prev.images || []), ...urls] }));
      toast.success(`${urls.length} image${urls.length > 1 ? "s" : ""} uploaded.`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const addImageUrl = () => {
    const url = urlDraft.trim();
    if (!url) return;
    if ((form.images || []).length >= 8) {
      return toast.error("A card can have at most 8 images.");
    }
    setForm((prev) => ({ ...prev, images: [...(prev.images || []), url] }));
    setUrlDraft("");
  };

  const removeImage = (index) =>
    setForm((prev) => ({
      ...prev,
      images: (prev.images || []).filter((_, i) => i !== index),
    }));

  const visible = blogs.filter((b) => {
    if (sectionFilter && b.section !== sectionFilter) return false;
    if (statusFilter && b.status !== statusFilter) return false;
    const q = search.trim().toLowerCase();
    if (q && !b.title?.toLowerCase().includes(q) && !b.slug?.toLowerCase().includes(q)) {
      return false;
    }
    return true;
  });

  return (
    <>
      <Navbar linkName="Blogs" />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
        <div className="p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                Blog cards
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {blogs.length} total · a card drops off the public page once its
                expiry date passes
              </p>
            </div>
            <Button
              type="button"
              onClick={openCreate}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Plus className="mr-2 h-4 w-4" /> New blog
            </Button>
          </div>

          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm rounded-2xl p-6">
            {/* Filters */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-72">
                <Search
                  className="absolute left-3 top-2.5 text-gray-400"
                  size={16}
                />
                <Input
                  placeholder="Search title or slug..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 rounded-full border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              <select
                className={`${inputCls} sm:w-56`}
                value={sectionFilter}
                onChange={(e) => setSectionFilter(e.target.value)}
                aria-label="Filter by section"
              >
                <option value="">All sections</option>
                {SECTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
              <select
                className={`${inputCls} sm:w-44`}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                aria-label="Filter by status"
              >
                <option value="">All statuses</option>
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700">
              <Table className="min-w-max w-full">
                <TableHeader className="bg-gray-50 dark:bg-gray-700/50">
                  <TableRow className="border-b border-gray-200 dark:border-gray-700">
                    <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">
                      Image
                    </TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">
                      Title
                    </TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">
                      Section
                    </TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">
                      Status
                    </TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">
                      Kind
                    </TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">
                      Order
                    </TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-300 font-semibold">
                      Live window
                    </TableHead>
                    <TableHead className="text-right text-gray-700 dark:text-gray-300 font-semibold">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="py-12 text-center">
                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-600" />
                      </TableCell>
                    </TableRow>
                  ) : visible.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="py-10 text-center text-sm text-gray-500 dark:text-gray-400"
                      >
                        No blogs match the current filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    visible.map((blog) => (
                      <TableRow
                        key={blog._id}
                        className="border-b border-gray-100 dark:border-gray-700"
                      >
                        <TableCell>
                          {blog.image ? (
                            <img
                              src={displaySrc(blog.image)}
                              alt=""
                              className="h-10 w-16 rounded object-cover border border-gray-200 dark:border-gray-600 bg-gray-100 dark:bg-gray-700"
                            />
                          ) : (
                            <div className="flex h-10 w-16 items-center justify-center rounded bg-gray-100 dark:bg-gray-700 text-gray-400">
                              <Search size={14} />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs">
                          <p className="truncate font-medium text-gray-900 dark:text-white">
                            {blog.title}
                          </p>
                          <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                            {blog.slug}
                          </p>
                        </TableCell>
                        <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                          {SECTIONS.find((s) => s.value === blog.section)?.label ||
                            blog.section ||
                            "—"}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              blog.status === "published"
                                ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
                                : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
                            }`}
                          >
                            {blog.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                          {blog.kind || "post"}
                        </TableCell>
                        <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                          {blog.order ?? "—"}
                        </TableCell>
                        <TableCell className="text-xs text-gray-500 dark:text-gray-400">
                          {`${toDateInput(blog.publishAt) || "any"} → ${
                            toDateInput(blog.expiresAt) || "never"
                          }`}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => openEdit(blog)}
                              aria-label={`Edit ${blog.title}`}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => setDeleteTarget(blog)}
                              aria-label={`Delete ${blog.title}`}
                              className="text-red-600 hover:text-red-700 dark:text-red-400"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>

      {/* Create / edit modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setModalOpen(false);
          }}
        >
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white dark:bg-gray-800 p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {editingId ? "Edit blog card" : "New blog card"}
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close"
                className="rounded p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={save} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Title *" wide>
                <Input
                  className={inputCls}
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                  placeholder="e.g. Resume Mistakes That Get You Rejected"
                />
              </Field>

              <Field label="Section *">
                <select
                  className={inputCls}
                  value={form.section}
                  onChange={(e) => set("section", e.target.value)}
                >
                  {SECTIONS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Status">
                <select
                  className={inputCls}
                  value={form.status}
                  onChange={(e) => set("status", e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Kind">
                <select
                  className={inputCls}
                  value={form.kind}
                  onChange={(e) => set("kind", e.target.value)}
                >
                  {KINDS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Order (sorts inside the section)">
                <Input
                  type="number"
                  className={inputCls}
                  value={form.order}
                  onChange={(e) => set("order", e.target.value)}
                  placeholder="1"
                />
              </Field>

              <Field label="Slug (blank = from title)">
                <Input
                  className={inputCls}
                  value={form.slug}
                  onChange={(e) => set("slug", e.target.value)}
                  placeholder="auto-generated"
                />
              </Field>

              <Field label="Card ID (detail-route number)">
                <Input
                  type="number"
                  className={inputCls}
                  value={form.cardId}
                  onChange={(e) => set("cardId", e.target.value)}
                  placeholder="e.g. 4"
                />
              </Field>

              <Field label="Category">
                <Input
                  className={inputCls}
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  placeholder="e.g. Career Advice"
                />
              </Field>

              <Field label="Subtitle (featured tiles)">
                <Input
                  className={inputCls}
                  value={form.subtitle}
                  onChange={(e) => set("subtitle", e.target.value)}
                  placeholder="e.g. remote work"
                />
              </Field>

              <Field label="Author">
                <Input
                  className={inputCls}
                  value={form.author}
                  onChange={(e) => set("author", e.target.value)}
                />
              </Field>

              <Field label="Display date (as shown on the card)">
                <Input
                  className={inputCls}
                  value={form.displayDate}
                  onChange={(e) => set("displayDate", e.target.value)}
                  placeholder="December 20, 2024"
                />
              </Field>

              <Field label="Link (blank = /blogs/slug)">
                <Input
                  className={inputCls}
                  value={form.link}
                  onChange={(e) => set("link", e.target.value)}
                  placeholder="/TrendingTopics/4"
                />
              </Field>

              <Field label="Publish from (blank = keep current)">
                <Input
                  type="date"
                  className={inputCls}
                  value={form.publishAt}
                  onChange={(e) => set("publishAt", e.target.value)}
                />
              </Field>

              <Field label="Expires on (blank = never)">
                <Input
                  type="date"
                  className={inputCls}
                  value={form.expiresAt}
                  onChange={(e) => set("expiresAt", e.target.value)}
                />
              </Field>

              <Field label="Images (first = cover, rotates on the card)" wide>
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    id="blog-image-input"
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    multiple
                    className="hidden"
                    onChange={onImageFiles}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document.getElementById("blog-image-input")?.click()
                    }
                    disabled={uploading || (form.images || []).length >= 8}
                  >
                    {uploading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="mr-2 h-4 w-4" />
                    )}
                    {uploading ? "Uploading..." : "Upload images"}
                  </Button>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {(form.images || []).length}/8
                  </span>
                </div>

                {(form.images || []).length > 0 && (
                  <div className="mt-2 grid grid-cols-4 sm:grid-cols-6 gap-2">
                    {form.images.map((src, i) => (
                      <div
                        key={`${src}-${i}`}
                        className="relative rounded border border-gray-200 dark:border-gray-600 overflow-hidden"
                      >
                        <img
                          src={displaySrc(src)}
                          alt={`image ${i + 1}`}
                          className="h-14 w-full object-cover"
                        />
                        {i === 0 && (
                          <span className="absolute bottom-0 left-0 bg-blue-600/90 text-white text-[10px] px-1.5 py-0.5">
                            Cover
                          </span>
                        )}
                        <button
                          type="button"
                          aria-label={`Remove image ${i + 1}`}
                          onClick={() => removeImage(i)}
                          className="absolute top-0 right-0 bg-black/60 hover:bg-black/80 text-white p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-2 flex gap-2">
                  <Input
                    className={inputCls}
                    value={urlDraft}
                    onChange={(e) => setUrlDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addImageUrl();
                      }
                    }}
                    placeholder="Or paste a URL (./local.webp or https://...)"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addImageUrl}
                    disabled={!urlDraft.trim()}
                  >
                    <Plus className="mr-1 h-4 w-4" /> Add
                  </Button>
                </div>
              </Field>

              <Field label="Excerpt (card description)" wide>
                <textarea
                  rows={3}
                  className={`${inputCls} resize-none`}
                  value={form.excerpt}
                  onChange={(e) => set("excerpt", e.target.value)}
                />
              </Field>

              <Field
                label="Full content (posts only — cards ignore this)"
                wide
              >
                <textarea
                  rows={4}
                  className={`${inputCls} resize-none`}
                  value={form.content}
                  onChange={(e) => set("content", e.target.value)}
                />
              </Field>

              <div className="sm:col-span-2 flex justify-end gap-3 border-t border-gray-200 dark:border-gray-700 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setModalOpen(false)}
                  className="text-gray-700 dark:text-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {editingId ? "Save changes" : "Create blog"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <DeleteConfirmation
        isOpen={!!deleteTarget}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </>
  );
};

export default Blogs;
