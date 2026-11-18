import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Calendar, User, Clock, SearchX, Loader2 } from "lucide-react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import API from "@/utils/api";

// Tailwind classes for markdown elements — the project has no typography
// plugin, so each tag is styled explicitly (keeps dark-mode parity with the
// hardcoded detail pages).
const mdComponents = {
  h1: ({ children }) => (
    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-4">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-8 mb-4">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-xl md:text-2xl font-semibold text-gray-900 dark:text-white mt-6 mb-3">
      {children}
    </h3>
  ),
  p: ({ children }) => (
    <p className="text-lg md:text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
      {children}
    </p>
  ),
  a: ({ href, children }) => (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-green-600 hover:text-green-700 underline break-words"
    >
      {children}
    </a>
  ),
  ul: ({ children }) => (
    <ul className="list-disc pl-6 mb-4 space-y-2 text-lg md:text-base text-gray-700 dark:text-gray-300">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="list-decimal pl-6 mb-4 space-y-2 text-lg md:text-base text-gray-700 dark:text-gray-300">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>
  ),
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-green-500 pl-4 italic text-gray-600 dark:text-gray-400 mb-4">
      {children}
    </blockquote>
  ),
  code: ({ className, children }) => {
    // Block-level code (inside <pre>) vs inline code
    if (className) {
      return (
        <code className={`${className} block`}>{children}</code>
      );
    }
    return (
      <code className="bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded text-sm">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 overflow-x-auto mb-4 text-sm">
      {children}
    </pre>
  ),
  hr: () => <hr className="border-gray-200 dark:border-gray-700 my-8" />,
  img: ({ src, alt }) => (
    <img src={src} alt={alt || ""} className="rounded-2xl my-6 w-full" loading="lazy" />
  ),
  table: ({ children }) => (
    <div className="overflow-x-auto mb-6">
      <table className="w-full border-collapse text-base text-gray-700 dark:text-gray-300">
        {children}
      </table>
    </div>
  ),
  thead: ({ children }) => (
    <thead className="bg-gray-100 dark:bg-gray-800">{children}</thead>
  ),
  th: ({ children }) => (
    <th className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-left font-semibold text-gray-900 dark:text-white">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">
      {children}
    </td>
  ),
  input: ({ type, checked, disabled }) => (
    <input type={type} checked={checked} disabled={disabled ?? true} readOnly className="mr-2" />
  ),
};

const formatDisplayDate = (blog) => {
  if (blog.displayDate) return blog.displayDate;
  const d = blog.publishAt ? new Date(blog.publishAt) : new Date(blog.createdAt);
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

const estimateReadTime = (content) => {
  if (!content) return 1;
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
};

const BlogPostDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | notfound | failed

  useEffect(() => {
    let alive = true;
    setStatus("loading");
    setBlog(null);
    API.get(`/v1/blogs/${encodeURIComponent(slug)}`)
      .then(({ data }) => {
        if (!alive) return;
        setBlog(data);
        setStatus("ready");
      })
      .catch((err) => {
        if (!alive) return;
        setStatus(err?.response?.status === 404 ? "notfound" : "failed");
      });
    return () => {
      alive = false;
    };
  }, [slug]);

  // ── Loading ──
  if (status === "loading") {
    return (
      <>
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
          <Loader2 className="w-8 h-8 animate-spin text-green-600" />
          <p className="text-gray-500">Loading article…</p>
        </div>
        <Footer />
      </>
    );
  }

  // ── 404 / server error ──
  if (status !== "ready" || !blog) {
    const isMissing = status === "notfound";
    return (
      <>
        <Helmet>
          <title>
            {isMissing ? "Article Not Found" : "Failed to Load"} | GreatHire Blog
          </title>
        </Helmet>
        <Navbar />
        <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 px-4 text-center">
          <SearchX className="w-12 h-12 text-gray-400" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            {isMissing ? "This article doesn't exist anymore" : "Something went wrong"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            {isMissing
              ? "It may have been unpublished or removed. Browse the latest articles instead."
              : "We couldn't load this article. Please check your connection and try again."}
          </p>
          <div className="flex gap-3 mt-2">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Go Back
            </button>
            <button
              onClick={() => navigate("/Main_blog_page")}
              className="px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white transition-colors"
            >
              Browse Blogs
            </button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // ── Article ──
  const excerpt = blog.excerpt || "";
  const hasContent = Boolean(blog.content && blog.content.trim());

  return (
    <>
      <Helmet>
        <title>{blog.title} | GreatHire Blog</title>
        <meta name="description" content={excerpt || blog.title} />
        <meta property="og:title" content={blog.title} />
        <meta property="og:description" content={excerpt || blog.title} />
        {blog.image && <meta property="og:image" content={blog.image} />}
        <meta property="og:type" content="article" />
      </Helmet>

      <Navbar />

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-teal-700 text-white py-16 md:py-20">
        {blog.image && (
          <>
            <img
              src={blog.image}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-black opacity-30" />
          </>
        )}
        <div className="relative container mx-auto px-4 sm:px-6">
          <button
            onClick={() => navigate("/Main_blog_page")}
            className="flex items-center gap-2 text-white/90 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Blogs
          </button>

          <div className="max-w-4xl">
            {blog.category && (
              <span className="inline-block bg-white/20 backdrop-blur-sm text-white text-sm font-medium px-3 py-1 rounded-full mb-4">
                {blog.category}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-bold mb-5 leading-tight">
              {blog.title}
            </h1>
            {blog.subtitle && (
              <p className="text-lg text-white/90 mb-5">{blog.subtitle}</p>
            )}

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-white/90 text-sm md:text-base">
              <span className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {blog.author || "GreatHire Team"}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDisplayDate(blog)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {estimateReadTime(blog.content)} min read
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="min-h-[40vh] bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-12 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          {hasContent ? (
            <article className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 p-6 md:p-10 transition-colors">
              <ReactMarkdown remarkPlugins={[remarkGfm]} components={mdComponents}>
                {blog.content}
              </ReactMarkdown>
            </article>
          ) : (
            // Cards without a full body still get a readable page.
            <article className="bg-white dark:bg-gray-900 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 p-6 md:p-10 transition-colors">
              {excerpt ? (
                <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                  {excerpt}
                </p>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">
                  This article doesn&apos;t have content yet.
                </p>
              )}
            </article>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default BlogPostDetail;
