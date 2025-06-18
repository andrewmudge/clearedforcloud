"use client";
import React, { useState } from "react";

// Expanded sample blog data
const blogEntries = [
  {
    id: 1,
    title: "First Blog Post",
    date: "2025-06-01",
    body:
      "Welcome to the first post of our blog! Here we discuss all things cloud, from the basics to advanced topics. Our goal is to help you navigate the ever-changing landscape of cloud computing. Whether you're a beginner or an experienced professional, you'll find valuable insights here. We'll cover best practices, share industry news, and provide hands-on tutorials. Stay tuned for regular updates and feel free to engage with us in the comments. Thank you for joining us on this journey into the cloud!",
  },
  {
    id: 2,
    title: "Cloud Security Best Practices",
    date: "2025-06-10",
    body: "Security in the cloud is paramount. Here are some best practices...",
  },
  {
    id: 3,
    title: "Migrating to Azure",
    date: "2025-06-15",
    body: "Azure migration can be smooth with the right planning. Let's explore how.",
  },
  {
    id: 4,
    title: "Understanding AWS Pricing",
    date: "2025-06-18",
    body: "AWS pricing can be complex. This post breaks down the basics for you.",
  },
  {
    id: 5,
    title: "Serverless Architectures Explained",
    date: "2025-06-20",
    body: "Serverless is changing the way we build apps. Learn the fundamentals here.",
  },
  {
    id: 6,
    title: "Kubernetes for Beginners",
    date: "2025-06-22",
    body: "Kubernetes can be intimidating. This guide will help you get started.",
  },
  {
    id: 7,
    title: "Multi-Cloud Strategies",
    date: "2025-06-25",
    body: "Should you use more than one cloud provider? Let's weigh the pros and cons.",
  },
  {
    id: 8,
    title: "CI/CD in the Cloud",
    date: "2025-06-27",
    body: "Continuous Integration and Deployment are easier than ever in the cloud.",
  },
  {
    id: 9,
    title: "Cost Optimization Tips",
    date: "2025-06-29",
    body: "Save money on your cloud bill with these practical tips.",
  },
  {
    id: 10,
    title: "Cloud Compliance Essentials",
    date: "2025-07-01",
    body: "Stay compliant in the cloud by following these essential guidelines.",
  },
];

// Highlight helper
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

const BlogPage: React.FC = () => {
  const [search, setSearch] = useState("");

  const filteredEntries = blogEntries.filter(
    (entry) =>
      entry.title.toLowerCase().includes(search.toLowerCase()) ||
      entry.body.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        maxWidth: 700,
        margin: "0 auto",
        padding: 24,
        overflowY: "auto",
        boxSizing: "border-box",
        background: "#fff",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Blog</h1>
      <input
        type="text"
        placeholder="Search blog..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: 10,
          marginBottom: 24,
          fontSize: 16,
          borderRadius: 6,
          border: "1px solid #ccc",
          color: "#000",
        }}
      />
      <div>
        {filteredEntries.length === 0 && (
          <p style={{ textAlign: "center", color: "#888" }}>No entries found.</p>
        )}
        {filteredEntries.map((entry, idx) => (
          <div
            key={entry.id}
            style={{
              background: "#f9f9f9",
              borderRadius: 8,
              marginBottom: idx === filteredEntries.length - 1 ? 0 : 24,
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              padding: 24,
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 24,
                right: 24,
                color: "#888",
                fontSize: 14,
              }}
            >
              {new Date(entry.date).toLocaleDateString()}
            </div>
            <h2 style={{ marginTop: 0, color: "#000", fontSize: 28 }}>
              {highlightText(entry.title, search)}
            </h2>
            <p style={{ marginBottom: 0, color: "#000", fontSize: 18 }}>
              {highlightText(entry.body, search)}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Header = () => (
  <header style={{ padding: "16px 0", textAlign: "center", background: "#f1f1f1" }}>
    <h1 style={{ margin: 0, fontSize: 24 }}>My Blog</h1>
  </header>
);

const Footer = () => (
  <footer style={{ padding: "16px 0", textAlign: "center", background: "#f1f1f1" }}>
    <p style={{ margin: 0, fontSize: 14 }}>© 2025 My Blog. All rights reserved.</p>
  </footer>
);

const App = () => (
  <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
    <Header />
    <main style={{ flex: 1 }}>
      <BlogPage />
    </main>
    <Footer />
  </div>
);

export default App;