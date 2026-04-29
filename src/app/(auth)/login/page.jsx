"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData(e.target);
      const result = await signIn("credentials", {
        email: formData.get("email"),
        password: formData.get("password"),
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }

      setLoading(false);
      router.refresh();
      router.push("/chat");
    } catch (error) {
      setError("An error occurred. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-8">
          <p
            className="text-xs font-medium tracking-widest uppercase mb-3"
            style={{
              color: "var(--brand-primary)",
              fontFamily: "var(--font-dm-mono)",
            }}
          >
            Welcome back
          </p>
          <h1
            className="text-3xl font-bold"
            style={{ color: "var(--brand-fg)" }}
          >
            Sign in to{" "}
            <span style={{ color: "var(--brand-primary)" }}>sift.ai</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Upload PDFs, ask questions, search the web with AI.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-5 px-4 py-3 rounded-lg border text-sm"
            style={{
              borderColor: "rgba(239,68,68,0.3)",
              background: "rgba(239,68,68,0.06)",
              color: "#f87171",
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-xs font-medium text-muted-foreground tracking-wide uppercase"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              required
              className="w-full px-4 py-2.5 rounded-lg border bg-transparent text-sm outline-none transition-all duration-200"
              style={{
                borderColor: "rgba(255,255,255,0.1)",
                color: "var(--brand-fg)",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "var(--brand-primary)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.1)")
              }
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-xs font-medium text-muted-foreground tracking-wide uppercase"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 rounded-lg border bg-transparent text-sm outline-none transition-all duration-200"
              style={{
                borderColor: "rgba(255,255,255,0.1)",
                color: "var(--brand-fg)",
              }}
              onFocus={(e) =>
                (e.target.style.borderColor = "var(--brand-primary)")
              }
              onBlur={(e) =>
                (e.target.style.borderColor = "rgba(255,255,255,0.1)")
              }
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200"
            style={{
              background: loading
                ? "rgba(163,230,53,0.4)"
                : "var(--brand-primary)",
              color: "var(--brand-bg)",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Signing in..." : "Sign in →"}
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-sm text-center text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-medium transition-colors"
            style={{ color: "var(--brand-primary)" }}
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
