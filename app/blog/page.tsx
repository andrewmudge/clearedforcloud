"use client";
import React, { useState } from "react";

// Expanded sample blog data
const blogEntries = [
    {
    id: 2,
    title: "Serverless Booking Project Improvement",
    date: "2025-06-19",
    body: "I wasn't able to figure out how amplify v6 is used for auth. That was suggested but I kept running into errors. I also hard coded a secret ID for ease of developement. In an actual project this would have to be managed via AWS Secrets. In an effort to keep learning I am acknowledging this error and continuing. Some big lessons learned for me were how valuable CI/CD is. It’s great to make a change, see it in local host and immediately get it to the web with 3 lines of CLI code with GitHub or GitHub actions. Some big errors I ran into was github actions failing the build. Use npm run build to check it locally before sending it for a workflow. Holistically when tackling a project think more about the best way to do it instead of jumping in blind with one component",
  },
  {
    id: 1,
    title: "First Blog Post",
    date: "2025-06-18",
    body:
      "Welcome to the first post of My blog! Today I published this website as well as a draft of my first app. There first app I made was a serverless event booking system for a AWS tech weekend. It uses Cognito, DynamoDB, Lambda, API Gateway, SES, S3. I will be adding more features to it in the future, but for now, it is a simple event booking system that allows users to book events and receive email notifications.\n\nThis website is intended to be a portfolio page for future employers to see my projects but I will also be posting things I've learned along the way so I can go back and reference for later",
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0">
              <span className="text-gray-400 text-sm">
                {new Date(entry.date).toLocaleDateString()}
              </span>
              <h2 className="font-bold text-black text-xl">
                {highlightText(entry.title, search)}
              </h2>
            </div>
            <p style={{ marginBottom: 0, color: "#000", fontSize: 18, whiteSpace: "pre-line" }}>
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