import React from 'react';
import { Link } from 'react-router-dom';

function BlogPage() {
  const blogPosts = [
    {
      id: 1,
      title: "The Future of AI in Recruitment",
      excerpt: "Discover how artificial intelligence is transforming the hiring landscape and making recruitment more efficient.",
      date: "May 15, 2024",
      category: "Technology"
    },
    {
      id: 2,
      title: "Building a Strong Employer Brand",
      excerpt: "Learn the essential strategies to create an employer brand that attracts top talent to your organization.",
      date: "May 12, 2024",
      category: "Branding"
    },
    {
      id: 3,
      title: "Remote Work Best Practices",
      excerpt: "Essential tips and strategies for managing remote teams effectively in the modern workplace.",
      date: "May 10, 2024",
      category: "Remote Work"
    },
    {
      id: 4,
      title: "Interview Techniques That Work",
      excerpt: "Master the art of conducting interviews that reveal the true potential of candidates.",
      date: "May 8, 2024",
      category: "Hiring"
    },
    {
      id: 5,
      title: "Diversity and Inclusion in Hiring",
      excerpt: "How to build diverse teams and create an inclusive workplace culture from the ground up.",
      date: "May 5, 2024",
      category: "Culture"
    },
    {
      id: 6,
      title: "Salary Negotiation Strategies",
      excerpt: "Navigate salary discussions with confidence using these proven negotiation techniques.",
      date: "May 3, 2024",
      category: "Career"
    }
  ];

  return (
    <div className="bg-black min-h-screen">
      {/* Hero Section */}
      <section className="bg-gray-900 py-12">
        <div className="container mx-auto px-6">
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-4">Our Blog</h1>
          <p className="text-white text-lg md:text-xl max-w-2xl">
            Insights, tips, and strategies for modern hiring and career growth
          </p>
        </div>
      </section>

      {/* Blog Grid Section */}
      <section className="container mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-gray-800 rounded-xl shadow-lg hover:bg-gray-700 transition-all duration-300 overflow-hidden"
            >
              <div className="p-6">
                <span className="text-white text-sm font-semibold bg-gray-700 px-3 py-1 rounded-full">
                  {post.category}
                </span>
                <h2 className="text-white text-2xl font-bold mt-4 mb-3">
                  {post.title}
                </h2>
                <p className="text-white text-base mb-4 leading-relaxed">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">{post.date}</span>
                  <Link
                    to={`/blog/${post.id}`}
                    className="text-white font-semibold hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-12">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
            Stay Updated
          </h2>
          <p className="text-white text-lg mb-6 max-w-2xl mx-auto">
            Subscribe to our newsletter for the latest hiring insights and career tips
          </p>
          <button className="bg-gray-800 hover:bg-gray-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg transition-all duration-300">
            Subscribe Now
          </button>
        </div>
      </section>
    </div>
  );
}

export default BlogPage;
