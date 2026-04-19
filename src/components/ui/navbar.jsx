"use client";

import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const pathname = usePathname();

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full border-b px-4 py-3 flex items-center justify-between">
      {/* Left — nav links */}
      <div className="flex items-center gap-4">
        <Link
          href="/chat"
          className={`text-sm font-medium transition-colors ${
            pathname.startsWith("/chat")
              ? "text-blue-500"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Chat
        </Link>
        <Link
          href="/upload"
          className={`text-sm font-medium transition-colors ${
            pathname.startsWith("/upload")
              ? "text-blue-500"
              : "text-gray-500 hover:text-gray-800"
          }`}
        >
          Upload
        </Link>
      </div>

      {/* Center — project name */}
      <div className="absolute left-1/2 -translate-x-1/2">
        <span className="font-semibold text-base tracking-tight">
          RAG PDF Chat
        </span>
      </div>

      {/* Right — user menu */}
      {session?.user && (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
          >
            {/* Avatar circle with first letter of email */}
            <div className="w-7 h-7 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold">
              {session.user.email?.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:block max-w-[140px] truncate">
              {session.user.email}
            </span>
            <svg
              className={`w-3 h-3 transition-transform ${menuOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown menu */}
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b">
                <p className="text-xs text-gray-400">Signed in as</p>
                <p className="text-sm font-medium truncate">
                  {session.user.email}
                </p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
