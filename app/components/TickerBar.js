"use client";

const TICKER_ITEMS = [
  "Gemini 3.1 drops with 2M token context window — free via Google AI Studio",
  "OpenAI shuts down Sora after 6 months — $15M/day burn with no revenue path",
  "Claude Opus 4.7 launches — built for multi-hour agentic workflows",
  "Gemini 3.1 can now read an entire codebase in a single API call",
  "Video AI space reopens after Sora shutdown — who fills the gap?",
  "Anthropic positions Opus 4.7 as the first truly hireable AI agent",
  "Google AI Studio opens free Gemini 3.1 access to all developers",
  "Agentic AI wave accelerates — tasks measured in hours, not seconds",
];

export default function TickerBar({ date }) {
  const tickerText = TICKER_ITEMS.join("   ·   ");

  return (
    <div className="bg-ink text-paper overflow-hidden border-b-2 border-accent">
      <div className="flex items-stretch">
        {/* Static label */}
        <div className="flex-shrink-0 bg-accent text-paper px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest flex items-center z-10">
          Breaking
        </div>

        {/* Scrolling ticker */}
        <div className="flex-1 overflow-hidden py-1.5 relative">
          <span className="ticker-track font-mono text-[11px] tracking-wide opacity-90">
            {tickerText}&nbsp;&nbsp;&nbsp;·&nbsp;&nbsp;&nbsp;{tickerText}
          </span>
        </div>

        {/* Date stamp */}
        <div className="flex-shrink-0 border-l border-paper/20 px-3 py-1.5 font-mono text-[10px] tracking-widest opacity-70 flex items-center whitespace-nowrap">
          {date}
        </div>
      </div>
    </div>
  );
}
