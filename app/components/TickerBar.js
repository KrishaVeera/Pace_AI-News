"use client";

import { useState, useEffect } from "react";

const HEADLINE_FALLBACK = [
  "Gemini 3.1 drops with 2M token context window — free via Google AI Studio",
  "OpenAI shuts down Sora after 6 months — $15M/day burn with no revenue path",
  "Claude Opus 4.7 launches — built for multi-hour agentic workflows",
  "Gemini 3.1 can now read an entire codebase in a single API call",
  "Video AI space reopens after Sora shutdown — who fills the gap?",
  "Anthropic positions Opus 4.7 as the first truly hireable AI agent",
  "Google AI Studio opens free Gemini 3.1 access to all developers",
  "Agentic AI wave accelerates — tasks measured in hours, not seconds",
];

function stockNodes(stocks, keyPrefix) {
  return stocks.map((s, i) => (
    <span key={`${keyPrefix}${i}`} className="whitespace-nowrap">
      {i > 0 && <span className="mx-3 opacity-40">·</span>}
      <span className="font-semibold">{s.displayName}</span>
      {" $"}{s.price.toFixed(2)}{" "}
      <span style={{ color: s.positive ? "#4ade80" : "#f87171" }}>
        {s.positive ? "▲" : "▼"} {s.positive ? "+" : ""}{Math.abs(s.changePercent).toFixed(2)}%
      </span>
    </span>
  ));
}

export default function TickerBar({ date, stories }) {
  const [stocks, setStocks] = useState(null);

  async function loadStocks() {
    try {
      const res = await fetch("/api/stocks");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setStocks(Array.isArray(data) && data.length >= 3 ? data : []);
    } catch {
      setStocks([]);
    }
  }

  useEffect(() => {
    loadStocks();
    const id = setInterval(loadStocks, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const showStocks = stocks && stocks.length >= 3;
  const fallbackText =
    stories?.length >= 3
      ? `${stories[0].headline}   ·   ${stories[1].headline}   ·   ${stories[2].headline}`
      : HEADLINE_FALLBACK.join("   ·   ");

  return (
    <div className="bg-ink text-paper overflow-hidden border-b-2 border-accent">
      <div className="flex items-stretch">
        {/* Label */}
        <div className="flex-shrink-0 bg-accent text-paper px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest flex items-center z-10">
          {showStocks ? "Markets" : "Breaking"}
        </div>

        {/* Scrolling content */}
        <div className="flex-1 overflow-hidden py-1.5 relative">
          {showStocks ? (
            <span className="ticker-track font-mono text-[11px] tracking-wide opacity-90">
              {stockNodes(stocks, "a")}
              <span className="mx-3 opacity-40">·</span>
              {stockNodes(stocks, "b")}
            </span>
          ) : (
            <span className="ticker-track font-mono text-[11px] tracking-wide opacity-90">
              {fallbackText}&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;{fallbackText}
            </span>
          )}
        </div>

        {/* Date stamp */}
        <div className="flex-shrink-0 border-l border-paper/20 px-3 py-1.5 font-mono text-[10px] tracking-widest opacity-70 flex items-center whitespace-nowrap">
          {date}
        </div>
      </div>
    </div>
  );
}
