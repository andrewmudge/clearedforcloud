"use client";

import { useState } from "react";

export default function HeaderWithToggle() {
  const [isOpen, setIsOpen] = useState(false);

  return (
 <header className="fixed top-0 left-0 w-full z-50 bg-gray-900 border-b-4 border-red-800 shadow-lg">

  {/* Top contact info row */}


  {/* Main header row */}
  <div className="flex justify-between items-center px-6 py-4">
    <div className="flex items-center text-xl font-bold tracking-widest text-white gap-2">
      <a href="/" className="flex items-center gap-2 hover:text-red-500 transition-colors">
        <img src="/jet2.svg" alt="Jet Icon" className="w-8 h-8" />
        Cleared For Cloud 
      </a>
    </div>

    {/* Desktop Menu */}
    <nav className="hidden md:flex space-x-6">
        <a href="/#about" className="hover:text-red-600 transition-colors">About</a>
        <a href="/#certifications" className="hover:text-red-600 transition-colors">Certifications</a>
        <a href="/projects" className="hover:text-red-600 transition-colors">Projects</a>
        <a href="/#contact" className="hover:text-red-600 transition-colors">Contact</a>
    </nav>

    {/* Mobile Toggle Button */}
    <button
      className="md:hidden text-red-500 z-50"
      onClick={() => setIsOpen(!isOpen)}
      aria-label="Toggle menu"
    >
      ☰
    </button>

    {/* Mobile Menu */}
    {isOpen && (
      <nav className="absolute top-16 left-0 w-full bg-gray-900 text-center flex flex-col space-y-4 py-4 border-t border-red-800 md:hidden z-50">
        <a href="/#about" className="hover:text-red-600 transition-colors">About</a>
        <a href="/#certifications" className="hover:text-red-600 transition-colors">Certifications</a>
        <a href="/projects" className="hover:text-red-600 transition-colors">Projects</a>
        <a href="/#contact" className="hover:text-red-600 transition-colors">Contact</a>
      </nav>
    )}
  </div>
</header>
  );
}
