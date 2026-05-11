"use client";

import { useState } from "react";
import Link from "next/link";

const CATEGORIES = [
  { value: "coder", label: "Coder" },
  { value: "data-science", label: "Data Science" },
  { value: "ui-ux", label: "UI/UX" },
];

export default function Footer({ date, issue }) {
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category) {
      setError("Please select a category.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, category }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-ink text-paper mt-0">
      {/* Accent stripe */}
      <div className="h-1 bg-accent" />

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 border-b border-paper/15 pb-10">
          {/* Brand */}
          <div>
            <h2 className="font-fraktur text-5xl text-paper mb-2">Pace</h2>
            <p className="font-baskerville text-xs italic text-paper leading-relaxed">
              5 minutes a day.<br />
              One thing to build.<br />
              Never fall behind.
            </p>
          </div>

          {/* Links */}
          <div className="md:mx-auto">
            <h3 className="font-mono text-[9px] uppercase tracking-widest text-paper mb-3">
              Navigation
            </h3>
            <ul className="space-y-2">
              {[
                { label: "Today", href: "/" },
                { label: "Archive", href: "#subscribe" },
                { label: "About", href: "#subscribe" },
                { label: "Subscribe", href: "#subscribe" },
              ].map(({ label, href }) => (
                <li key={label}>
                  <a
                    href={href}
                    className="font-baskerville text-xs text-paper hover:text-paper/70 transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Email signup */}
          <div id="subscribe">
            <h3 className="font-mono text-[9px] uppercase tracking-widest text-paper mb-3">
              Daily Briefing
            </h3>
            <p className="font-baskerville text-xs text-paper mb-4 leading-relaxed">
              Get Pace delivered to your inbox every morning at 7 AM.
            </p>
            {success ? (
              <p className="font-mono text-xs text-accent tracking-wide">
                ✓ You&rsquo;re in! Check your inbox tomorrow morning.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                {/* Category buttons */}
                <div className="flex gap-1">
                  {CATEGORIES.map(({ value, label }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setCategory(value)}
                      className={`flex-1 font-mono text-[9px] uppercase tracking-widest px-2 py-1.5 border transition-colors ${
                        category === value
                          ? "bg-accent border-accent text-paper"
                          : "bg-transparent border-paper/60 text-paper hover:border-paper hover:text-paper"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {/* Email + submit */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="flex-1 bg-paper/10 border border-paper/40 text-paper placeholder:text-paper/70 font-mono text-xs px-3 py-2 focus:outline-none focus:border-paper transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={loading || !category}
                    className="bg-accent hover:bg-accent/80 disabled:opacity-40 disabled:cursor-not-allowed text-paper font-mono text-[10px] uppercase tracking-widest px-4 py-2 transition-colors whitespace-nowrap"
                  >
                    {loading ? "..." : "Subscribe"}
                  </button>
                </div>

                {error && (
                  <p className="font-mono text-[10px] text-red-400 tracking-wide">{error}</p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <span className="font-mono text-[9px] tracking-widest text-paper/60 uppercase">
            Vol. I · No. {issue} · {date}
          </span>
          <span className="font-mono text-[9px] tracking-widest text-paper/60 uppercase">
            © 2026 Pace Daily. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}
