"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser } from "@/actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.target);

    const result = await registerUser(formData);

    if (!result.success) {
      setError(result.error);
      setLoading(false);
      return;
    }

    router.push("/login");
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6">
      <h1 className="text-2xl font-bold mb-6 text-foreground">Register</h1>

      {error && <p className="text-destructive mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="border border-border bg-input text-foreground p-2 rounded-md"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="border border-border bg-input text-foreground p-2 rounded-md"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-primary text-primary-foreground p-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p className="mt-4 text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="text-primary hover:text-primary/80">
          Login
        </Link>
      </p>
    </div>
  );
}
