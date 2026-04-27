"use client";

import { useState, useRef, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/chat", label: "Chat" },
  // { href: "/upload", label: "Upload" },
  { href: "/ai-search", label: "AI Search" },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    function handleClickOutside(e) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <nav className="w-full border-b border-border bg-card px-4 py-3 flex items-center justify-between relative">
      <div className="flex items-center gap-4">
        <Link
          href="#"
          className="md:hidden text-sm font-medium text-muted-foreground hover:text-foreground"
          onClick={(e) => {
            e.preventDefault();
            setMobileMenuOpen(!mobileMenuOpen);
          }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileMenuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </Link>

        <div className="hidden md:flex items-center gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname.startsWith(link.href)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2">
        <span className="text-sm sm:text-base font-semibold tracking-tight">
          Sift-ai
        </span>
      </div>

      {status === "loading" ? (
        <div className="w-7 h-7 rounded-full bg-muted animate-pulse" />
      ) : session ? (
        <div className="relative" ref={userMenuRef}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary transition-colors cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              {session.user.email?.charAt(0).toUpperCase()}
            </div>
            <svg
              className={`w-3 h-3 transition-transform hidden sm:block ${userMenuOpen ? "rotate-180" : ""}`}
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

          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-lg py-1 z-50">
              <div className="px-4 py-2 border-b border-border">
                <p className="text-xs text-muted-foreground">Signed in as</p>
                <p className="text-sm font-medium truncate">
                  {session.user.email}
                </p>
              </div>
              <div className="py-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setUserMenuOpen(false)}
                    className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                      pathname.startsWith(link.href)
                        ? "text-primary bg-accent"
                        : "text-foreground hover:bg-accent"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
              <div className="border-t border-border pt-1">
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-accent transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Link
          href="/login"
          className="text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          Sign In
        </Link>
      )}

      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-card border-b border-border p-4 flex flex-col gap-3 z-50 md:hidden shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-base font-medium transition-colors ${
                pathname.startsWith(link.href)
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {!session && (
            <Link
              href="/login"
              className="text-base font-medium text-muted-foreground hover:text-foreground"
            >
              Sign In
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
