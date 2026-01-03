import React from "react";
import { Link } from "react-router-dom";
import { Calendar, User, ArrowRight, Tag } from "lucide-react";

export const BlogPage: React.FC = () => {
  const posts = [
    {
      title: "10 Ways AI is Transforming Modern Agriculture",
      excerpt:
        "Discover how artificial intelligence is revolutionizing farming practices and helping farmers increase yields while reducing costs.",
      author: "Dr. Sarah Johnson",
      date: "Nov 5, 2025",
      readTime: "8 min read",
      category: "AI & Technology",
      image: "from-purple-500 to-pink-500",
    },
    {
      title: "Weather Patterns and Crop Planning: A Data-Driven Approach",
      excerpt:
        "Learn how to use weather forecasts and historical data to optimize your planting schedule and irrigation strategy.",
      author: "Michael Chen",
      date: "Nov 1, 2025",
      readTime: "6 min read",
      category: "Weather & Climate",
      image: "from-blue-500 to-cyan-500",
    },
    {
      title: "Market Timing: When to Sell Your Crops for Maximum Profit",
      excerpt:
        "Understanding market cycles and price trends can significantly impact your bottom line. Here's what you need to know.",
      author: "Rajesh Kumar",
      date: "Oct 28, 2025",
      readTime: "10 min read",
      category: "Markets & Economics",
      image: "from-green-500 to-emerald-500",
    },
    {
      title: "Disease Detection Using Computer Vision: A Complete Guide",
      excerpt:
        "How our AI-powered disease detection works and how you can use it to protect your crops early.",
      author: "Dr. Emily Martinez",
      date: "Oct 25, 2025",
      readTime: "7 min read",
      category: "Crop Health",
      image: "from-red-500 to-pink-500",
    },
    {
      title: "Sustainable Farming Practices for 2025",
      excerpt:
        "Explore eco-friendly farming techniques that increase productivity while protecting the environment.",
      author: "David Thompson",
      date: "Oct 20, 2025",
      readTime: "9 min read",
      category: "Sustainability",
      image: "from-green-600 to-teal-500",
    },
    {
      title: "The Future of Precision Agriculture",
      excerpt:
        "IoT sensors, drones, and satellite imagery are changing how we farm. Here's what's coming next.",
      author: "Lisa Anderson",
      date: "Oct 15, 2025",
      readTime: "11 min read",
      category: "Innovation",
      image: "from-indigo-500 to-purple-500",
    },
  ];

  const categories = [
    "All",
    "AI & Technology",
    "Weather & Climate",
    "Markets & Economics",
    "Crop Health",
    "Sustainability",
    "Innovation",
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-green-50/30">      <nav className="fixed top-0 w-full glass border-b border-gray-200/50 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-linear-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xl">🌾</span>
          </div>
          <span className="text-xl font-bold gradient-text">AgriAI</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-gray-700 hover:text-green-600 font-medium"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-emerald-900 hover:bg-emerald-800 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>      <section className="pt-32 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            AgriAI Blog
          </h1>
          <p className="text-xl text-gray-600">
            Insights, tips, and stories from the future of farming
          </p>
        </div>
      </section>      <section className="px-4 mb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category, idx) => (
              <button
                key={idx}
                className={`px-4 py-2 rounded-lg font-medium transition ${idx === 0
                  ? "bg-emerald-900 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, idx) => (
              <article
                key={idx}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden card-hover"
              >                <div
                className={`h-48 bg-linear-to-br ${post.image} flex items-center justify-center`}
              >
                  <Tag className="text-white opacity-30" size={64} />
                </div>                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                      {post.category}
                    </span>
                    <span>{post.readTime}</span>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User size={16} />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar size={16} />
                      <span>{post.date}</span>
                    </div>
                  </div>

                  <Link
                    to={`/blog/${idx + 1}`}
                    className="mt-4 inline-flex items-center gap-2 text-green-600 font-semibold hover:gap-3 transition-all"
                  >
                    Read More
                    <ArrowRight size={18} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>      <section className="px-4 pb-20">
        <div className="max-w-4xl mx-auto bg-linear-to-r from-green-500 to-emerald-600 rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-green-100 mb-6">
            Get the latest articles and farming insights delivered to your inbox
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 rounded-lg outline-none"
            />
            <button className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold hover:shadow-xl transition">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
