"use client";
import { useState, ReactNode } from "react";

interface ExpandProjectProps {
  title: string;
  description: ReactNode;
  link: string;
  documentation: string;
  imgSrc: string;
  imgAlt: string;
  externalLink?: string;
  defaultCollapsedHeight?: number; // px
}

export default function ExpandProject({
  title,
  description,
  link,
  documentation,
  imgSrc,
  imgAlt,
  externalLink,
  defaultCollapsedHeight = 384, // 24rem
}: ExpandProjectProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="relative flex flex-col-reverse md:flex-row bg-gray-800 p-6 rounded-lg border border-red-700 shadow-md hover:border-red-500 transition">
      {/* Text Section */}
      <div className="flex-1 pr-0 md:pr-8 flex flex-col justify-between">
        <div
          className="relative transition-all duration-300"
          style={
            expanded
              ? { maxHeight: "none", overflow: "visible" }
              : { maxHeight: defaultCollapsedHeight, overflow: "hidden" }
          }
        >
          <h2 className="text-2xl text-red-400 font-bold mb-4">{title}</h2>
          {description}
          {!expanded && (
            <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-gray-800 to-transparent pointer-events-none" />
          )}
        </div>
        {/* Link and GitHub Repo left-aligned */}
        <div className="mt-4 flex flex-row items-center gap-4">
          <a
            href={link}
            className="inline-block text-white hover:underline font-semibold"
          >
            Link
          </a>
          {externalLink && (
            <a
              href={externalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-white hover:underline font-semibold"
            >
              GitHub Repo
            </a>
          )}
        </div>
      </div>
      {/* Image Section */}
      <div className="hidden md:block mt-6 md:mt-0 flex-shrink-0">
        <img
          src={imgSrc}
          alt={imgAlt}
          className="max-w-xs rounded-lg"
          style={{ objectFit: "contain" }}
        />
      </div>
      {/* View More centered absolutely at the bottom of the bordered card */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-6 flex justify-center w-full pointer-events-none">
        <button
          className="pointer-events-auto font-bold text-white border border-red-500 rounded px-6 py-2 hover:bg-red-600 transition"
          onClick={() => setExpanded((v) => !v)}
          type="button"
        >
          {expanded ? "View Less" : "View More"}
        </button>
      </div>
    </div>
  );
}