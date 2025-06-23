"use client";
import React, { useState } from "react";
import Image from "next/image";

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

// --- HARDCODED BLOG ENTRIES ---
const HARDCODED_BLOG_ENTRIES: BlogEntry[] = [
  {
    id: "1",
    title: "Welcome to Cleared for Cloud!",
    date: "2024-06-18",
    category: "General",
    image: "/firstblog.png",
    body: `There’s something deeply satisfying about building systems that solve real problems—especially when those systems are scalable, secure, and entirely virtual. That’s what drew me to cloud computing.

This blog is my personal platform to document my cloud journey: the lessons I’m learning, the projects I’m building, and the tools and technologies I’m using along the way. I created it not only to track my own progress, but to contribute to the larger community of learners, builders, and professionals who are also figuring things out one service at a time.
Right now, I’m focused on mastering the AWS ecosystem—Lambda, API Gateway, DynamoDB, Cognito, S3, and more. I'm using tools like the Serverless Framework and Terraform to automate infrastructure and build applications the way modern cloud-native teams do it. As I go, I’ll be writing up the technical breakdowns, deployment strategies, architecture decisions, and hard lessons that come with hands-on learning.
You won’t find generic cloud theory here. This blog will be project-driven, code-backed, and focused on practical implementation. Whether I’m building an event booking system, a portfolio app, or securing a serverless API, I’ll explain the what, why, and how.
If you're someone who's learning cloud, switching careers, or just curious how real-world cloud solutions are built—this blog is for you. Thanks for reading, and stay tuned.

— Andrew`,
  },
  {
    id: "2",
    title: "LINUX CLI Bootcamp Day 1",
    date: "2024-06-20",
    category: "Learning",
    image: "/linux_blog_post.png",
    body: "Today I started my Linux CLI bootcamp course. I created a Ubuntu EC2 instance with a pem key allowing me to SSH into the instance. I created a .bat file that I placed on the desktop so all I have to do is click the file and a new windows command prompt will open and directly connect me to the server. The sudo apt install ncal didn’t work so I had to use sudo apt udate to update the apt package lists. It worked after applying the update and running sudo apt install ncal.",
  },
  // Add more blog entries as needed
];

const BlogPage: React.FC = () => {
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<{ [id: string]: boolean }>({});

  const filteredEntries = HARDCODED_BLOG_ENTRIES
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

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 pt-2 pb-2 flex flex-col md:flex-row md:items-center gap-2">
        <input
          type="text"
          placeholder="Search blog..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 px-4 py-2 rounded border border-gray-600 bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
        />
      </div>

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
      </div>
    </div>
  );
};

export default BlogPage;