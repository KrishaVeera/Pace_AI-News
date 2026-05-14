"use client";

import { useState } from "react";

const FALLBACK_DROPS = [
  {
    category: "Coder",
    tool: "Gemini API",
    stack: "Python",
    prompt: `Build a Python script that takes a GitHub repo URL, fetches the README and main files using the GitHub API, sends them to Gemini, and returns: what the project does, how to run it, and what problem it solves.`,
  },
  {
    category: "Data Science",
    tool: "Gemini API",
    stack: "Python · Pandas",
    prompt: `Build a Jupyter notebook that takes a CSV file and a research paper URL as inputs, sends both to Gemini, and asks it to assess whether the data supports the paper's key claims. Output a verdict with reasoning.`,
  },
  {
    category: "UI/UX",
    tool: "Gemini Vision API",
    stack: "No code needed",
    prompt: `Use the Gemini API to build a simple form where you upload a UI screenshot and get back a structured critique: what's working, what's confusing, and the single most important thing to fix.`,
  },
];

function buildDrops(drops) {
  if (!drops) return FALLBACK_DROPS;
  return [
    { category: "Coder",        ...drops.coder },
    { category: "Data Science", ...drops.dataScience },
    { category: "UI/UX",        ...drops.uiUx },
  ];
}

function PromptBox({ code }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-4 border border-ink/30 bg-ink rounded-sm overflow-hidden">
      {/* Terminal title bar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-paper/10">
        <div className="flex gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-accent/70" />
          <span className="w-2.5 h-2.5 rounded-full bg-paper/20" />
          <span className="w-2.5 h-2.5 rounded-full bg-paper/20" />
        </div>
        <button
          onClick={handleCopy}
          className="font-mono text-[9px] uppercase tracking-widest text-paper/40 hover:text-paper/80 transition-colors"
        >
          {copied ? "Copied!" : "Copy Prompt"}
        </button>
      </div>

      {/* Code */}
      <pre className="font-mono text-[10px] leading-relaxed text-paper/85 p-4 overflow-x-auto whitespace-pre-wrap cursor-blink">
        {code}
      </pre>
    </div>
  );
}

export default function TodaysDrop({ drops }) {
  const activeDrops = buildDrops(drops);

  return (
    <section className="bg-paper px-6 py-6 max-w-6xl mx-auto">
      {/* Section header */}
      <div className="mb-6">
        <div className="single-rule mb-2" />
        <h2 className="font-playfair text-[10px] uppercase tracking-[0.35em] text-ink text-center">
          Today&rsquo;s Drop
        </h2>
        <div className="single-rule mt-2" />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-ink/25">
        {activeDrops.map((drop, i) => (
          <div
            key={i}
            className={`px-0 md:px-5 py-4 md:py-0 ${i === 0 ? "md:pl-0" : ""} ${i === activeDrops.length - 1 ? "md:pr-0" : ""}`}
          >
            {/* Category badge */}
            <span className="inline-block font-mono text-[9px] uppercase tracking-widest border border-accent text-accent px-2 py-0.5 mb-3">
              {drop.category}
            </span>

            {/* Tool name */}
            <h3 className="font-playfair font-bold text-lg leading-snug text-ink mb-1">
              {drop.tool}
            </h3>

            {/* Stack */}
            <p className="font-mono text-[10px] text-ink/45 tracking-wide mb-2">
              {drop.stack}
            </p>

            {/* Prompt terminal */}
            <PromptBox code={drop.prompt} />
          </div>
        ))}
      </div>
    </section>
  );
}
