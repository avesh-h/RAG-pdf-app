"use client";

import { useState } from "react";
import { useInView } from "../../hooks/use-in-view";

export function PdfChatMockup() {
  const messages = [
    { from: "user", text: "What are the key skills mentioned in this resume?" },
    {
      from: "ai",
      text: "Based on the document, the key skills include React, Node.js, PostgreSQL, and experience with AI/ML pipelines.",
    },
    { from: "user", text: "Can you summarize the work experience?" },
    {
      from: "ai",
      text: "The candidate has 3 years of full-stack development experience with two tech startups focusing on developer tooling and AI integration.",
    },
  ];

  const files = [
    { name: "Resume.pdf", date: "4/29/2026", active: true },
    { name: "Contract.pdf", date: "4/28/2026", active: false },
  ];

  return (
    <div
      className="flex flex-col sm:flex-row rounded-2xl overflow-hidden"
      style={{
        border: "1px solid rgba(255,255,255,0.1)",
        background: "#0f0f0f",
        boxShadow:
          "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)",
        minHeight: "340px",
        maxHeight: "420px",
      }}
    >
      {/* ── Sidebar ──
          mobile: horizontal scroll row at top with bottom border
          sm+:    vertical column on left with right border
      */}
      <div
        className="flex flex-row sm:flex-col w-full sm:w-[155px] sm:flex-shrink-0 p-3 gap-2 sm:gap-0 overflow-x-auto sm:overflow-x-visible border-b sm:border-b-0 sm:border-r"
        style={{
          borderColor: "rgba(255,255,255,0.07)",
          background: "#0a0a0a",
        }}
      >
        <p className="hidden sm:block text-[0.8rem] font-semibold text-white mb-3 px-1 flex-shrink-0">
          Your Files
        </p>
        <p className="sm:hidden text-[0.72rem] font-semibold text-white self-center flex-shrink-0 mr-1 whitespace-nowrap">
          Files:
        </p>

        {files.map((f) => (
          <div
            key={f.name}
            className="flex-shrink-0 p-2 rounded-lg sm:mb-1 cursor-pointer"
            style={
              f.active
                ? {
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }
                : { border: "1px solid transparent" }
            }
          >
            <span className="block text-[0.75rem] font-medium text-white/90 whitespace-nowrap">
              {f.name}
            </span>
            <span
              className="block text-[0.68rem] mt-0.5"
              style={{ color: "rgba(232,230,225,0.35)" }}
            >
              {f.date}
            </span>
          </div>
        ))}
      </div>

      {/* ── Chat area ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <div
          className="px-3 py-2 flex flex-col flex-shrink-0"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
        >
          <span
            className="text-[0.7rem]"
            style={{ color: "rgba(232,230,225,0.4)" }}
          >
            Chatting with
          </span>
          <span className="text-[0.82rem] font-semibold text-white">
            Resume.pdf
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 p-3 flex flex-col gap-2 overflow-hidden min-h-0">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] px-3 py-2 rounded-xl text-[0.73rem] leading-relaxed ${
                m.from === "user" ? "self-end" : "self-start"
              }`}
              style={
                m.from === "user"
                  ? {
                      background: "rgba(255,255,255,0.08)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "rgba(232,230,225,0.9)",
                    }
                  : {
                      background: "rgba(163,230,53,0.07)",
                      border: "1px solid rgba(163,230,53,0.15)",
                      color: "rgba(232,230,225,0.85)",
                    }
              }
            >
              {m.text}
            </div>
          ))}
        </div>

        {/* Input bar */}
        <div
          className="px-3 py-2 flex items-center justify-between gap-2 flex-shrink-0"
          style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
        >
          <span
            className="text-[0.72rem] truncate"
            style={{ color: "rgba(232,230,225,0.25)" }}
          >
            Ask anything about this document...
          </span>
          <div
            className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[0.75rem]"
            style={{
              background: "rgba(255,255,255,0.08)",
              color: "rgba(232,230,225,0.5)",
            }}
          >
            ↑
          </div>
        </div>
      </div>
    </div>
  );
}

export function AiSearchMockup() {
  const [step, setStep] = useState(0);
  const steps = [
    {
      query: "What is the James Webb telescope?",
      answer:
        "The James Webb Space Telescope (JWST) is a space telescope designed primarily to conduct infrared astronomy. As the most powerful telescope ever launched, it enables observations of the first galaxies formed in the early universe.",
      tag: "New question → web search triggered",
      tagColor: "#3b82f6",
    },
    {
      query: "Can you give me more details on exoplanets?",
      answer:
        "Building on the previous answer — JWST has already observed atmospheres of exoplanets like WASP-39b, detecting CO₂, SO₂, and water vapor. First direct chemical fingerprinting of a planet outside our solar system.",
      tag: "Follow-up detected → no new search",
      tagColor: "#22c55e",
    },
  ];
  const current = steps[step];

  return (
    <div
      className="rounded-2xl overflow-hidden flex flex-col"
      style={{
        border: "1px solid rgba(255,255,255,0.1)",
        background: "#0f0f0f",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <span className="block text-[0.875rem] font-semibold text-white">
          AI Web Search
        </span>
        <span
          className="block text-[0.72rem] mt-0.5"
          style={{ color: "rgba(232,230,225,0.4)" }}
        >
          Search the web and get AI-summarized answers
        </span>
      </div>

      {/* Body */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div
          className="self-end max-w-[90%] px-3 py-2 rounded-xl text-[0.75rem] text-white/90"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          {current.query}
        </div>
        <div
          className="self-start px-3 py-1 rounded-full text-[0.68rem] font-medium"
          style={{
            background: current.tagColor + "22",
            color: current.tagColor,
            border: `1px solid ${current.tagColor}44`,
          }}
        >
          {current.tag}
        </div>
        <div
          className="text-[0.77rem] leading-6 px-3 py-3 rounded-xl"
          style={{
            background: "rgba(163,230,53,0.04)",
            border: "1px solid rgba(163,230,53,0.1)",
            color: "rgba(232,230,225,0.75)",
          }}
        >
          {current.answer}
        </div>
      </div>

      {/* Toggle buttons */}
      <div
        className="flex gap-2 px-4 py-2.5 flex-wrap"
        style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
      >
        {["1st question", "Follow-up"].map((label, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className="px-3 py-1 rounded-full border-none cursor-pointer text-[0.7rem] font-medium transition-all"
            style={
              step === i
                ? { background: "rgba(163,230,53,0.15)", color: "#a3e635" }
                : {
                    background: "rgba(255,255,255,0.06)",
                    color: "rgba(232,230,225,0.4)",
                  }
            }
          >
            {label}
          </button>
        ))}
      </div>

      {/* Search input bar */}
      <div
        className="px-4 py-2.5"
        style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
      >
        <span
          className="text-[0.75rem]"
          style={{ color: "rgba(232,230,225,0.2)" }}
        >
          Search anything... e.g. Roadmap to learn Web3
        </span>
      </div>
    </div>
  );
}

export function UploadMockup() {
  const [dragging, setDragging] = useState(false);

  return (
    <div
      className="rounded-2xl overflow-hidden p-6 sm:p-8 flex flex-col items-center"
      style={{
        border: "1px solid rgba(255,255,255,0.1)",
        background: "#0f0f0f",
        boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
      }}
    >
      <p className="text-[1.1rem] sm:text-[1.2rem] font-bold text-white text-center">
        Upload PDF
      </p>
      <p
        className="text-[0.78rem] mt-1 text-center"
        style={{ color: "rgba(232,230,225,0.4)" }}
      >
        Upload a PDF file to start chatting with it
      </p>
      <div
        className="mt-5 w-full rounded-xl py-8 sm:py-10 px-4 flex flex-col items-center gap-2 cursor-pointer transition-all duration-300"
        style={{
          border: `1.5px dashed ${dragging ? "rgba(163,230,53,0.5)" : "rgba(255,255,255,0.12)"}`,
          background: dragging ? "rgba(163,230,53,0.04)" : "transparent",
        }}
        onMouseEnter={() => setDragging(true)}
        onMouseLeave={() => setDragging(false)}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
          style={{
            background: "rgba(255,255,255,0.07)",
            color: "rgba(232,230,225,0.6)",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>
        <p className="text-[0.85rem] font-semibold text-white/90 text-center">
          Drag & drop your PDF here
        </p>
        <p
          className="text-[0.75rem] text-center"
          style={{ color: "rgba(232,230,225,0.35)" }}
        >
          or click to browse
        </p>
        <p
          className="text-[0.7rem] mt-1 text-center"
          style={{ color: "rgba(232,230,225,0.25)" }}
        >
          Only PDF files are supported
        </p>
      </div>
    </div>
  );
}

export function Section({ children, className = "" }) {
  const [ref, visible] = useInView();
  return (
    <section
      ref={ref}
      className={`py-24 transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </section>
  );
}

export function FeatureChip({ label }) {
  return (
    <span
      className="px-3 py-1 rounded-full text-[0.78rem]"
      style={{
        border: "1px solid rgba(255,255,255,0.1)",
        background: "rgba(255,255,255,0.04)",
        color: "rgba(232,230,225,0.6)",
      }}
    >
      {label}
    </span>
  );
}
