"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AiSearchMockup,
  FeatureChip,
  PdfChatMockup,
  Section,
  UploadMockup,
} from "@/components/home/content";

export default function HomePage() {
  const [heroVisible, setHeroVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  const vis = heroVisible;

  return (
    <div
      style={{
        background: "#080808",
        color: "#e8e6e1",
        fontFamily: "'DM Sans', 'Helvetica Neue', Arial, sans-serif",
      }}
    >
      {/* ── Nav ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-8 h-14 border-b border-white/[0.06]"
        style={{ background: "rgba(8,8,8,0.85)", backdropFilter: "blur(12px)" }}
      >
        <Link
          href="/"
          className="text-sm sm:text-base font-medium hover:opacity-80 transition-opacity text-foreground"
          style={{ fontFamily: "var(--font-dm-mono)" }}
        >
          sift<span style={{ color: "#a3e635" }}>.</span>ai
        </Link>
        <div className="flex gap-6 items-center">
          <Link
            href="/ai-search"
            className="text-white/55 text-sm no-underline hover:text-white transition-colors"
          >
            AI Search
          </Link>
          <Link
            href="/chat"
            className="px-4 py-1.5 rounded-md text-sm font-semibold no-underline transition-opacity hover:opacity-85"
            style={{ background: "#a3e635", color: "#080808" }}
          >
            Start for free →
          </Link>
        </div>
      </nav>

      <main className="relative z-[1]">
        {/* ── Hero ── */}
        <div
          className="min-h-screen flex flex-col items-center justify-center text-center px-6 pt-28 pb-20"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(163,230,53,0.07) 0%, transparent 70%)",
          }}
        >
          {/* Eyebrow */}
          <span
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[0.78rem] font-medium tracking-widest uppercase transition-all duration-700"
            style={{
              border: "1px solid rgba(163,230,53,0.3)",
              background: "rgba(163,230,53,0.06)",
              color: "#a3e635",
              opacity: vis ? 1 : 0,
              transform: vis ? "translateY(0)" : "translateY(12px)",
            }}
          >
            <span>⬡</span> RAG-powered document intelligence
          </span>

          {/* H1 */}
          <h1
            className="mt-5 font-serif text-[clamp(2.8rem,7vw,5.5rem)] font-normal leading-[1.05] tracking-tight text-white transition-all duration-700 delay-150"
            style={{
              opacity: vis ? 1 : 0,
              transform: vis ? "translateY(0)" : "translateY(18px)",
            }}
          >
            Stop reading.
            <br />
            <em style={{ fontStyle: "italic", color: "#a3e635" }}>
              Start asking.
            </em>
          </h1>

          {/* Subtitle */}
          <p
            className="mt-5 max-w-[560px] text-[1.05rem] leading-7 transition-all duration-700 delay-[280ms]"
            style={{
              color: "rgba(232,230,225,0.55)",
              opacity: vis ? 1 : 0,
              transform: vis ? "translateY(0)" : "translateY(18px)",
            }}
          >
            Sift-ai lets you upload any PDF and instantly query it with AI —
            like having a conversation with your document. Plus a
            Perplexity-style web search that reasons over live results.
          </p>

          {/* CTA buttons */}
          <div
            className="mt-8 flex gap-3 flex-wrap justify-center transition-all duration-700 delay-[400ms]"
            style={{
              opacity: vis ? 1 : 0,
              transform: vis ? "translateY(0)" : "translateY(18px)",
            }}
          >
            <Link
              href="/chat"
              className="px-6 py-2.5 rounded-lg text-[0.9rem] font-bold no-underline inline-flex items-center gap-1 transition-all hover:opacity-90 hover:-translate-y-px"
              style={{ background: "#a3e635", color: "#080808" }}
            >
              Chat with a PDF →
            </Link>
            <Link
              href="/ai-search"
              className="px-6 py-2.5 rounded-lg text-[0.9rem] font-medium no-underline inline-flex items-center gap-1 transition-all hover:border-white/30 hover:text-white hover:-translate-y-px"
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(232,230,225,0.8)",
              }}
            >
              Try AI Search
            </Link>
          </div>

          {/* Scroll hint */}
          <div
            className="mt-16 flex flex-col items-center gap-1 text-[0.75rem] tracking-widest uppercase transition-opacity duration-[800ms] delay-[800ms]"
            style={{ color: "rgba(232,230,225,0.25)", opacity: vis ? 1 : 0 }}
          >
            <span>Explore</span>
            <div
              className="w-px h-9 animate-scroll-pulse"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(163,230,53,0.6), transparent)",
              }}
            />
          </div>
        </div>

        {/* ── Feature 1: PDF Chat ── */}
        <Section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-[1100px] mx-auto px-6">
            <div>
              <p
                className="font-mono text-[0.72rem] font-medium tracking-widest uppercase mb-3"
                style={{ color: "#a3e635" }}
              >
                Feature 01 — PDF Chat
              </p>
              <h2 className="font-serif text-[clamp(1.9rem,4vw,3rem)] font-normal leading-[1.1] tracking-tight text-white mb-4">
                Your PDF,
                <br />
                <em style={{ color: "#a3e635" }}>interrogated.</em>
              </h2>
              <p
                className="text-base leading-7 max-w-[520px] mb-5"
                style={{ color: "rgba(232,230,225,0.6)" }}
              >
                Upload any PDF — a research paper, contract, resume, or report.
                Sift-ai extracts, chunks, and embeds every sentence into a
                vector database. Ask any question and get pinpoint answers
                grounded in the actual document — no hallucinations, no
                guessing.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <FeatureChip label="Vector similarity search" />
                <FeatureChip label="pgvector + NeonDB" />
                <FeatureChip label="Llama 3.3 70B" />
                <FeatureChip label="Contextual chunking" />
              </div>
              <Link
                href="/chat"
                className="px-6 py-2.5 rounded-lg text-[0.9rem] font-bold no-underline inline-flex items-center gap-1 transition-all hover:opacity-90"
                style={{ background: "#a3e635", color: "#080808" }}
              >
                Upload a PDF →
              </Link>
            </div>
            <PdfChatMockup />
          </div>
        </Section>

        <div
          className="max-w-[1100px] mx-auto h-px"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />

        {/* ── Feature 2: Smart Upload ── */}
        <Section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-[1100px] mx-auto px-6 direction-rtl">
            <div className="direction-ltr">
              <p
                className="font-mono text-[0.72rem] font-medium tracking-widest uppercase mb-3"
                style={{ color: "#a3e635" }}
              >
                Feature 02 — Smart Upload
              </p>
              <h2 className="font-serif text-[clamp(1.9rem,4vw,3rem)] font-normal leading-[1.1] tracking-tight text-white mb-4">
                Drop it.
                <br />
                <em style={{ color: "#a3e635" }}>It's ready.</em>
              </h2>
              <p
                className="text-base leading-7 max-w-[520px] mb-5"
                style={{ color: "rgba(232,230,225,0.6)" }}
              >
                Drag and drop your PDF. Sift-ai automatically extracts the full
                text, splits it into overlapping 200-character chunks to
                preserve context at boundaries, then generates 384-dimensional
                embeddings for every chunk — all before you type your first
                question.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <FeatureChip label="unpdf extraction" />
                <FeatureChip label="Overlap chunking" />
                <FeatureChip label="HuggingFace embeddings" />
                <FeatureChip label="all-MiniLM-L6-v2" />
              </div>
              <Link
                href="/chat"
                className="px-6 py-2.5 rounded-lg text-[0.9rem] font-bold no-underline inline-flex items-center gap-1 transition-all hover:opacity-90"
                style={{ background: "#a3e635", color: "#080808" }}
              >
                Try it now →
              </Link>
            </div>
            <UploadMockup />
          </div>
        </Section>

        <div
          className="max-w-[1100px] mx-auto h-px"
          style={{ background: "rgba(255,255,255,0.06)" }}
        />

        {/* ── Feature 3: AI Search ── */}
        <Section>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center max-w-[1100px] mx-auto px-6">
            <div>
              <p
                className="font-mono text-[0.72rem] font-medium tracking-widest uppercase mb-3"
                style={{ color: "#a3e635" }}
              >
                Feature 03 — AI Web Search
              </p>
              <h2 className="font-serif text-[clamp(1.9rem,4vw,3rem)] font-normal leading-[1.1] tracking-tight text-white mb-4">
                Search smarter.
                <br />
                <em style={{ color: "#a3e635" }}>Ask follow-ups.</em>
              </h2>
              <p
                className="text-base leading-7 max-w-[520px] mb-5"
                style={{ color: "rgba(232,230,225,0.6)" }}
              >
                Ask any question about the world — Sift-ai searches the web via
                Tavily, pulls the top 5 sources, and synthesises a grounded
                answer. Ask a follow-up and it intelligently detects context
                continuity — no repeat searches, just deeper answers.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <FeatureChip label="Tavily Search API" />
                <FeatureChip label="Follow-up detection" />
                <FeatureChip label="Full conversation context" />
                <FeatureChip label="Perplexity-style" />
              </div>
              <Link
                href="/ai-search"
                className="px-6 py-2.5 rounded-lg text-[0.9rem] font-medium no-underline inline-flex items-center gap-1 transition-all hover:border-white/30 hover:text-white"
                style={{
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "rgba(232,230,225,0.8)",
                }}
              >
                Try AI Search →
              </Link>
            </div>
            <AiSearchMockup />
          </div>
        </Section>

        {/* ── How it works ── */}
        <div className="py-24 px-6 max-w-[1100px] mx-auto">
          <div className="text-center mb-4">
            <p
              className="font-mono text-[0.72rem] font-medium tracking-widest uppercase mb-3"
              style={{ color: "#a3e635" }}
            >
              Under the hood
            </p>
            <h2 className="font-serif text-[clamp(1.9rem,4vw,3rem)] font-normal leading-[1.1] tracking-tight text-white max-w-[600px] mx-auto">
              How <em style={{ color: "#a3e635" }}>Sift-ai</em> works
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                n: "01",
                title: "Extract & chunk",
                body: "unpdf pulls raw text from your PDF. The text is split into 200-char chunks with 20-char overlaps so context never breaks at a boundary.",
              },
              {
                n: "02",
                title: "Embed into vectors",
                body: "Every chunk is converted to a 384-dimensional vector by HuggingFace's all-MiniLM-L6-v2. Similar meaning → similar vectors, stored in NeonDB with pgvector.",
              },
              {
                n: "03",
                title: "Query & retrieve",
                body: "Your question becomes a vector too. pgvector's cosine similarity search finds the 5 most relevant chunks in milliseconds.",
              },
              {
                n: "04",
                title: "Ground the LLM",
                body: "Retrieved chunks are injected as context into the Groq Llama 3.3 70B prompt. The model answers strictly from your document — no fabrication.",
              },
              {
                n: "05",
                title: "Web search mode",
                body: "Switch to AI Search and Tavily fetches live web results. The same LLM synthesises them into a coherent, cited answer.",
              },
              {
                n: "06",
                title: "Follow-up intelligence",
                body: "A lightweight intent classifier decides: is this a follow-up or a new question? Follow-ups skip the web search and answer from conversation history.",
              },
            ].map((card) => (
              <div
                key={card.n}
                className="p-7 rounded-2xl border transition-all duration-300 hover:-translate-y-1"
                style={{
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "rgba(255,255,255,0.02)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(163,230,53,0.25)";
                  e.currentTarget.style.background = "rgba(163,230,53,0.03)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                }}
              >
                <p
                  className="font-mono text-[0.72rem] tracking-widest mb-3"
                  style={{ color: "#a3e635" }}
                >
                  {card.n}
                </p>
                <p className="text-base font-semibold text-white mb-2">
                  {card.title}
                </p>
                <p
                  className="text-[0.875rem] leading-7"
                  style={{ color: "rgba(232,230,225,0.5)" }}
                >
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Limitation banner ── */}
        <div className="max-w-[1100px] mx-auto px-6 mb-16">
          <div
            className="flex gap-4 items-start p-5 rounded-xl"
            style={{
              border: "1px solid rgba(234,179,8,0.25)",
              background: "rgba(234,179,8,0.04)",
            }}
          >
            <span className="text-lg flex-shrink-0 mt-0.5">⚠</span>
            <div>
              <p
                className="text-[0.875rem] font-semibold mb-1"
                style={{ color: "#fbbf24" }}
              >
                Current limitation — session-only memory
              </p>
              <p
                className="text-[0.83rem] leading-7"
                style={{ color: "rgba(232,230,225,0.5)" }}
              >
                Chat history is not persisted. Once you refresh the page,
                navigate away, or close the tab, all previous messages are
                cleared. Each session starts fresh. This applies to both the PDF
                Chat and AI Search features.
              </p>
            </div>
          </div>
        </div>

        {/* ── Final CTA ── */}
        <div
          className="py-28 px-6 text-center"
          style={{
            background:
              "radial-gradient(ellipse 60% 60% at 50% 100%, rgba(163,230,53,0.08) 0%, transparent 70%)",
          }}
        >
          <h2 className="font-serif text-[clamp(2rem,5vw,3.5rem)] font-normal tracking-tight text-white mb-4">
            Ready to <em style={{ color: "#a3e635" }}>sift</em>
            <br />
            through anything?
          </h2>
          <p
            className="text-base mb-8 max-w-[440px] mx-auto leading-7"
            style={{ color: "rgba(232,230,225,0.5)" }}
          >
            Upload your first PDF or fire a search query. No setup, no friction.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/chat"
              className="px-6 py-2.5 rounded-lg text-[0.9rem] font-bold no-underline inline-flex items-center gap-1 transition-all hover:opacity-90"
              style={{ background: "#a3e635", color: "#080808" }}
            >
              Chat with a PDF →
            </Link>
            <Link
              href="/ai-search"
              className="px-6 py-2.5 rounded-lg text-[0.9rem] font-medium no-underline inline-flex items-center gap-1 transition-all hover:border-white/30 hover:text-white"
              style={{
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(232,230,225,0.8)",
              }}
            >
              Try AI Search
            </Link>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer
          className="flex justify-between items-center px-8 py-6 text-[0.8rem]"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            color: "rgba(232,230,225,0.3)",
          }}
        >
          <a
            href="/"
            className="font-mono font-semibold no-underline"
            style={{ color: "rgba(232,230,225,0.4)" }}
          >
            sift<span style={{ color: "#a3e635" }}>.</span>ai
          </a>
          <span>Built with Groq · pgvector · Tavily · Next.js</span>
        </footer>
      </main>
    </div>
  );
}
