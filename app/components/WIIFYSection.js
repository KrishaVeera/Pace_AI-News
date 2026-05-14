"use client";

import { useState } from "react";

const FALLBACK_TABS = {
  Coder: {
    label: "Coder",
    decode: `The 2M token context window means you can paste an entire GitHub repo into Gemini and ask it to find bugs, explain architecture, or suggest refactors. This changes your daily coding workflow more than any other release this month.`,
  },
  "Data Science": {
    label: "Data Science",
    decode: `A 2M context window means feeding entire datasets, research papers, and experiment logs into one conversation. Ask it to find whether your data supports a paper's claims — no chunking, no workarounds.`,
  },
  "UI/UX": {
    label: "UI/UX",
    decode: `Gemini now processes images and video natively. Paste a screenshot of any app and get a detailed UX critique. It's like having a senior designer available for free, any time.`,
  },
};

function buildTabs(decodes) {
  if (!decodes) return FALLBACK_TABS;
  return {
    Coder: {
      label: "Coder",
      decode: decodes.coder || FALLBACK_TABS.Coder.decode,
    },
    "Data Science": {
      label: "Data Science",
      decode: decodes.dataScience || FALLBACK_TABS["Data Science"].decode,
    },
    "UI/UX": {
      label: "UI/UX",
      decode: decodes.uiUx || FALLBACK_TABS["UI/UX"].decode,
    },
  };
}

export default function WIIFYSection({ decodes }) {
  const [active, setActive] = useState("Coder");
  const TABS = buildTabs(decodes);

  return (
    <section className="bg-paper px-6 py-6 max-w-6xl mx-auto">
      {/* Section header */}
      <div className="mb-5">
        <div className="single-rule mb-2" />
        <h2 className="font-playfair text-[10px] uppercase tracking-[0.35em] text-ink text-center">
          What&rsquo;s In It For You
        </h2>
        <div className="single-rule mt-2" />
      </div>

      {/* Tab row — scrollable on mobile */}
      <div className="w-full overflow-x-auto mb-0">
        <div className="flex border border-ink/25 w-max mx-auto">
          {Object.keys(TABS).map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={[
                "font-mono text-[10px] uppercase tracking-widest px-5 py-2 border-r border-ink/25 last:border-r-0 transition-colors whitespace-nowrap",
                active === tab
                  ? "bg-ink text-paper"
                  : "bg-paper text-ink/50 hover:text-ink",
              ].join(" ")}
            >
              {TABS[tab].label}
            </button>
          ))}
        </div>
      </div>

      {/* Decode panel — fades in when tab changes */}
      <div key={active} className="border border-t-0 border-ink/25 p-6 bg-paper panel-fade-in">
        <p className="font-baskerville text-sm leading-[1.9] text-ink drop-cap">
          {TABS[active].decode}
        </p>
      </div>
    </section>
  );
}
