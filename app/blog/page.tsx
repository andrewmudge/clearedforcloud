"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import AdminLogin from "../components/AdminLogin";
import CreateBlogPost from "../components/CreateBlogPost";

type BlogEntry = {
  id: string;
  title: string;
  date: string;
  category: string;
  image?: string;
  body: string;
};

function highlightText(text: string, query: string) {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} style={{ background: "#ffe066", color: "#000", padding: 0 }}>
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function getReadTime(text: string = "") {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
}

function getExcerpt(text: string = "", maxSentences = 2) {
  const sentences = text.match(/[^.!?]+[.!?]+[\])'"`'"]*|.+/g) || [];
  return sentences.slice(0, maxSentences).join(" ");
}

// Client-only date formatting to avoid hydration errors
function BlogDate({ date }: { date: string }) {
  const [formatted, setFormatted] = React.useState(date);
  React.useEffect(() => {
    setFormatted(
      new Date(date).toLocaleDateString("en-US", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).toUpperCase()
    );
  }, [date]);
  return <>{formatted}</>;
}

const BlogPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<{ [id: string]: boolean }>({});
  const [blogEntries, setBlogEntries] = useState<BlogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);

  // Check for existing admin token on load
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      setAdminToken(token);
    }
  }, []);

  // Fetch blog posts
  const fetchBlogPosts = async () => {
    try {
      const response = await fetch('/api/blog/list');
      const data = await response.json();
      setBlogEntries(data.posts || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      // Fallback to hardcoded entries if API fails
      setBlogEntries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const filteredEntries = blogEntries
    .slice()
    .sort((a, b) => {
      if (a.date !== b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return Number(b.id) - Number(a.id);
    })
    .filter(
      (entry) =>
        (entry.title?.toLowerCase() || "").includes(search.toLowerCase()) ||
        (entry.body?.toLowerCase() || "").includes(search.toLowerCase())
    );

  const handleAdminLogin = (token: string) => {
    setAdminToken(token);
    setShowAdminLogin(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setAdminToken(null);
  };

  const handleCreateSuccess = () => {
    fetchBlogPosts(); // Refresh the blog posts
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black flex items-center justify-center">
        <div className="text-white text-xl">Loading blog posts...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      {/* Blog Title */}
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-wide text-center drop-shadow-lg">
          BLOG
        </h1>
        <h2 className="text-lg md:text-xl text-gray-300 text-center mt-2 mb-2 font-medium">
          My personal logbook documenting the journey from fighter pilot to cloud professional
        </h2>
        <div className="mx-auto mt-2 mb-6 w-24 h-1 bg-red-700 rounded"></div>
      </div>

      {/* Search Bar and Admin Controls */}
      <div className="max-w-7xl mx-auto px-4 pt-2 pb-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <input
          type="text"
          placeholder="Search blog..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 rounded border border-gray-600 bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
        />
        
        {/* Admin Controls */}
        <div className="flex gap-2">
          {adminToken ? (
            <>
              <button
                onClick={() => setShowCreatePost(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md transition-colors"
              >
                Create Post
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowAdminLogin(true)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-md transition-colors"
            >
              Admin
            </button>
          )}
        </div>
      </div>

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {filteredEntries.length === 0 ? (
          <div className="text-center text-gray-400 text-xl">
            No blog posts found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEntries.map((entry) => {
              const isExpanded = expanded[entry.id];
              const safeBody = entry.body || "";
              const excerpt = getExcerpt(safeBody, 2);
              const needsExpand = safeBody.trim() !== excerpt.trim();

              return (
                <div
                  key={entry.id}
                  className="bg-[#23272b] rounded-lg shadow p-8 flex flex-col h-full"
                >
                  <span className="uppercase text-blue-400 text-xs font-semibold mb-2 tracking-wider">
                    {entry.category || "Archives"}
                  </span>
                  {entry.image && (
                    <Image
                      src={entry.image}
                      alt={entry.title}
                      width={400}
                      height={192}
                      className="w-full h-48 object-contain rounded mb-4 border border-gray-700 bg-black"
                    />
                  )}
                  <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
                    {highlightText(entry.title, search)}
                  </h2>
                  <p
                    className="text-gray-300 mb-6 text-base"
                    style={{ minHeight: 80, whiteSpace: "pre-line" }}
                  >
                    {highlightText(isExpanded ? entry.body : excerpt, search)}
                    {needsExpand && (
                      <>
                        {" "}
                        {isExpanded ? (
                          <button
                            onClick={() =>
                              setExpanded((prev) => ({ ...prev, [entry.id]: false }))
                            }
                            className="text-red-400 underline ml-1 text-sm"
                          >
                            View Less
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              setExpanded((prev) => ({ ...prev, [entry.id]: true }))
                            }
                            className="text-red-400 underline ml-1 text-sm"
                          >
                            View More
                          </button>
                        )}
                      </>
                    )}
                  </p>
                  <div className="flex items-center mt-auto">
                    <Image
                      src="/profile.jpg"
                      alt="Andrew Mudge"
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-full mr-3 border-2 border-gray-700"
                    />
                    <div>
                      <div className="text-xs text-gray-300 font-semibold">ANDREW MUDGE</div>
                      <div className="text-xs text-gray-400 flex items-center gap-2">
                        <BlogDate date={entry.date} />
                        <span className="mx-1">•</span>
                        {getReadTime(entry.body || "")} MIN READ
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAdminLogin && (
        <AdminLogin onLogin={handleAdminLogin} />
      )}
      {showCreatePost && adminToken && (
        <CreateBlogPost
          token={adminToken}
          onClose={() => setShowCreatePost(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
};

export default BlogPage;