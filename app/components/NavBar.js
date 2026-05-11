"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = ["Today", "Archive", "About", "Subscribe"];

export default function NavBar() {
  const [active, setActive] = useState("Today");
  const [showComingSoon, setShowComingSoon] = useState(false);

  function handleClick(link) {
    setActive(link);
    if (link === "Archive" || link === "About") {
      setShowComingSoon(true);
    } else {
      setShowComingSoon(false);
      if (link === "Subscribe") {
        document.getElementById("subscribe")?.scrollIntoView({ behavior: "smooth" });
      }
    }
  }

  return (
    <>
      <nav className="bg-paper border-b border-ink/30 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-0">
          {NAV_LINKS.map((link, i) => {
            const baseClass = [
              "font-baskerville text-xs uppercase tracking-[0.2em] px-6 py-3 transition-colors border-b-2 -mb-px",
              active === link
                ? "border-accent text-accent font-bold"
                : "border-transparent text-ink/60 hover:text-ink",
              i !== 0 ? "border-l border-l-ink/20" : "",
            ].join(" ");

            if (link === "Today") {
              return (
                <Link
                  key={link}
                  href="/"
                  onClick={() => { setActive("Today"); setShowComingSoon(false); }}
                  className={baseClass}
                >
                  {link}
                </Link>
              );
            }
            return (
              <button key={link} onClick={() => handleClick(link)} className={baseClass}>
                {link}
              </button>
            );
          })}
        </div>
      </nav>
      {showComingSoon && (
        <div className="bg-paper border-b border-ink/20 py-2 text-center">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink/40">
            Coming Soon
          </span>
        </div>
      )}
    </>
  );
}
