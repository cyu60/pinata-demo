"use client";

import Link from "next/link";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/public-files", label: "Upload Public Files" },
  { href: "/group-files", label: "All Public Files" },
  { href: "/text2speech-storage", label: "Text to Speech" },
];

export default function Header() {
  return (
    <header className="w-full bg-blue-600 text-white shadow-lg sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">
            <Link
              href="/"
              className="hover:text-blue-100 transition-colors duration-200"
            >
              Pinata Demo
            </Link>
          </h1>

          <ul className="flex space-x-8">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="hover:text-blue-100 transition-colors duration-200 font-medium 
                    hover:underline underline-offset-4"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
