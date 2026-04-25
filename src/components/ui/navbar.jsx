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
    <nav className="w-full border-b border-border bg-card px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link
          href="/chat"
          className={`text-sm font-medium transition-colors ${
            pathname.startsWith("/chat")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Chat
        </Link>
        <Link
          href="/upload"
          className={`text-sm font-medium transition-colors ${
            pathname.startsWith("/upload")
              ? "text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Upload
        </Link>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 hidden sm:block">
        <span className="font-semibold text-base tracking-tight">RAG PDF Chat</span>
      </div>

      {session?.user && (
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              {session.user.email?.charAt(0).toUpperCase()}
            </div>
            <span className="hidden md:block max-w-[140px] truncate">
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

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-popover border border-border rounded-lg shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b border-border">
                <p className="text-xs text-muted-foreground">Signed in as</p>
                <p className="text-sm font-medium truncate">
                  {session.user.email}
                </p>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-accent transition-colors"
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