"use client";
import { useState, ReactNode, Children } from "react";
import Image from "next/image";

interface ExpandProjectProps {
  title: string;
  description: ReactNode;
  link: string;
  imgSrc: string;
  imgAlt: string;
  externalLink?: string;
}

export default function ExpandProject({
  title,
  description,
  link,
  imgSrc,
  imgAlt,
  externalLink,
}: ExpandProjectProps) {
  const [expanded, setExpanded] = useState(false);

  // Always convert description to an array of nodes
  const descArray = Children.toArray(description);

  // Find the index of the <p> that contains "Tech Stack"
  const techStackIdx = descArray.findIndex((el: React.ReactNode) => {
    // Check for <strong>Tech Stack:</strong> or just "Tech Stack"
    if (
      typeof el === "object" &&
      el !== null &&
      "props" in el &&
      (el as { props?: { children?: React.ReactNode | React.ReactNode[] } }).props?.children
    ) {
      const children = (el as { props: { children: React.ReactNode | React.ReactNode[] } }).props.children;
      // If children is an array, check each child
      if (Array.isArray(children)) {
        return children.some(
          (child: React.ReactNode) =>
            (typeof child === "string" &&
              child.toLowerCase().includes("tech stack")) ||
            (typeof child === "object" &&
              child !== null &&
              "props" in child &&
              typeof (child as { props?: { children?: React.ReactNode } }).props?.children === "string" &&
              ((child as { props: { children: string } }).props.children)
                .toLowerCase()
                .includes("tech stack"))
        );
      }
      // If children is a string
      if (
        typeof children === "string" &&
        children.toLowerCase().includes("tech stack")
      ) {
        return true;
      }
      // If children is a React element (e.g., <strong>Tech Stack:</strong>)
      if (
        typeof children === "object" &&
        children !== null &&
        "props" in children &&
        typeof (children as { props?: { children?: React.ReactNode } }).props?.children === "string" &&
        ((children as { props: { children: string } }).props.children)
          .toLowerCase()
          .includes("tech stack")
      ) {
        return true;
      }
    }
    return false;
  });

  const preview =
    techStackIdx !== -1 ? descArray.slice(0, techStackIdx + 1) : descArray;
  const more =
    techStackIdx !== -1 ? descArray.slice(techStackIdx + 1) : [];

  return (
    <div className="relative flex flex-col-reverse md:flex-row bg-gray-800 p-6 rounded-lg border border-red-700 shadow-md hover:border-red-500 transition">
      {/* Text Section */}
      <div className="flex-1 pr-0 md:pr-8 flex flex-col justify-between">
        <div className="relative transition-all duration-300">
          <h2 className="text-2xl text-red-400 font-bold mb-4">{title}</h2>
          {preview}
          {expanded && more}
          {!expanded && more.length > 0 && (
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
        {/* View More button below links */}
        {more.length > 0 && (
          <div className="mt-4 mx-auto">
            <button
              className="font-bold text-white border border-red-500 rounded px-6 py-2 hover:bg-red-600 transition"
              onClick={() => setExpanded((v) => !v)}
              type="button"
            >
              {expanded ? "View Less" : "View More"}
            </button>
          </div>
        )}
      </div>
      {/* Image Section */}
      {!expanded && (
        <div className="hidden md:block mt-6 md:mt-0 flex-shrink-0">
          <Image
            src={imgSrc}
            alt={imgAlt}
            width={320} // or your preferred width
            height={200} // or your preferred height
            className="max-w-xs rounded-lg"
            style={{ objectFit: "contain" }}
          />
        </div>
      )}
    </div>
  );
}