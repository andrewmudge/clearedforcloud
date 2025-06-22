"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";

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
  const sentences = text.match(/[^.!?]+[.!?]+[\])'"`’”]*|.+/g) || [];
  return sentences.slice(0, maxSentences).join(" ");
}

// Client-only date formatting to avoid hydration errors
function BlogDate({ date }: { date: string }) {
  const [formatted, setFormatted] = useState(date);
  useEffect(() => {
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
  const [blogEntries, setBlogEntries] = useState<BlogEntry[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({
    category: "",
    title: "",
    image: "",
    body: "",
  });
  const [expanded, setExpanded] = useState<{ [id: string]: boolean }>({});

  // Fetch blog posts from DynamoDB via API route
  useEffect(() => {
    fetch("/api/blog")
      .then((res) => res.json())
      .then(setBlogEntries);
  }, []);

  // Handle form input changes
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submit
  const handleAddPost = async (e: FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.body) return;
    const res = await fetch("/api/blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost),
    });
    const saved = await res.json();
    setBlogEntries([saved, ...blogEntries]);
    setShowModal(false);
    setNewPost({ category: "", title: "", image: "", body: "" });
  };

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

      {/* Search Bar and Add Post Button */}
      <div className="max-w-7xl mx-auto px-4 pt-2 pb-2 flex flex-col md:flex-row md:items-center gap-2">
        <input
          type="text"
          placeholder="Search blog..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 rounded border border-gray-600 bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
        />
        <button
          onClick={() => setShowModal(true)}
          className="w-full md:w-auto bg-red-700 hover:bg-red-800 text-white font-semibold px-6 py-2 rounded shadow transition md:ml-2"
        >
          + Add Post
        </button>
      </div>

      {/* Add Post Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold text-white mb-4">Add New Blog Post</h2>
            <form onSubmit={handleAddPost} className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-1">Category</label>
                <input
                  type="text"
                  name="category"
                  value={newPost.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded border border-gray-700 bg-gray-800 text-white"
                  placeholder="e.g. Projects, Blog"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Title</label>
                <input
                  type="text"
                  name="title"
                  value={newPost.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded border border-gray-700 bg-gray-800 text-white"
                  placeholder="Blog post title"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Cover Image URL</label>
                <input
                  type="text"
                  name="image"
                  value={newPost.image}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded border border-gray-700 bg-gray-800 text-white"
                  placeholder="/project1.png or https://..."
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">Body</label>
                <textarea
                  name="body"
                  value={newPost.body}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 rounded border border-gray-700 bg-gray-800 text-white"
                  rows={6}
                  placeholder="Write your blog post here..."
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-red-700 hover:bg-red-800 text-white font-semibold px-6 py-2 rounded shadow transition w-full"
              >
                Add Post
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Blog Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
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
                  <img
                    src={entry.image}
                    alt={entry.title}
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
                  <img
                    src="/profile.jpg"
                    alt="Andrew Mudge"
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
      </div>
    </div>
  );
};

export default BlogPage;