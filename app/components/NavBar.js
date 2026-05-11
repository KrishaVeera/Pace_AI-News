"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function NavBar() {
  const pathname = usePathname();
  const [showComingSoon, setShowComingSoon] = useState(false);

  const active =
    pathname === "/" ? "Today" :
    pathname.startsWith("/archive") ? "Archive" :
    null;

  function cls(name, i) {
    return [
      "font-baskerville text-xs uppercase tracking-[0.2em] px-6 py-3 transition-colors border-b-2 -mb-px",
      active === name
        ? "border-accent text-accent font-bold"
        : "border-transparent text-ink/60 hover:text-ink",
      i !== 0 ? "border-l border-l-ink/20" : "",
    ].join(" ");
  }

  return (
    <>
      <nav className="bg-paper border-b border-ink/30 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-0">
          <Link href="/" className={cls("Today", 0)}>
            Today
          </Link>
          <Link
            href="/archive"
            onClick={() => setShowComingSoon(false)}
            className={cls("Archive", 1)}
          >
            Archive
          </Link>
          <button
            onClick={() => setShowComingSoon((s) => !s)}
            className={cls("About", 2)}
          >
            About
          </button>
          <button
            onClick={() => {
              setShowComingSoon(false);
              document.getElementById("subscribe")?.scrollIntoView({ behavior: "smooth" });
            }}
            className={cls("Subscribe", 3)}
          >
            Subscribe
          </button>
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
