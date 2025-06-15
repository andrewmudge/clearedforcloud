"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HeaderWithToggle() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-gray-900 border-b-4 border-red-800 shadow-lg">

      {/* Main header row */}
      <div className="flex justify-between items-center px-6 py-4">
        <div className="flex items-center text-xl font-bold tracking-widest text-white gap-2">
          <Link href="/" className="flex items-center gap-2 hover:text-red-500 transition-colors">
            <Image src="/jet2.svg" alt="Jet Icon" width={32} height={32} />
            Cleared For Cloud
          </Link>
        </div>

        {/* Desktop Menu */}
        <nav className="hidden md:flex space-x-6">
          <Link href="/#about" className="hover:text-red-600 transition-colors">About</Link>
          <Link href="/#certifications" className="hover:text-red-600 transition-colors">Certifications</Link>
          <Link href="/projects" className="hover:text-red-600 transition-colors">Projects</Link>
          <Link href="/#contact" className="hover:text-red-600 transition-colors">Contact</Link>
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
            <Link href="/#about" className="hover:text-red-600 transition-colors">About</Link>
            <Link href="/#certifications" className="hover:text-red-600 transition-colors">Certifications</Link>
            <Link href="/projects" className="hover:text-red-600 transition-colors">Projects</Link>
            <Link href="/#contact" className="hover:text-red-600 transition-colors">Contact</Link>
          </nav>
        )}
      </div>
    </header>
  );
}
