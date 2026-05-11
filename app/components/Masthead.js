export default function Masthead({ date }) {
  return (
    <header className="bg-paper px-6 pt-6 pb-0">
      {/* Top thin rule */}
      <div className="border-t-4 border-ink mb-3" />

      {/* Meta row */}
      <div className="flex justify-between items-center mb-2">
        <span className="font-mono text-[10px] tracking-widest uppercase text-ink/60">
          Created by{" "}
          <a
            href="https://animated-english-93e.notion.site/Krisha-Veera-s-Project-Portfolio-d8df759e5a3843779be8e992922af5c2"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent hover:underline"
          >
            Krisha Veera
          </a>
        </span>
        <span className="font-mono text-[10px] tracking-widest uppercase text-ink/60">
          {date}
        </span>
        <span className="font-mono text-[10px] tracking-widest uppercase text-ink/60">
          Free Daily Edition
        </span>
      </div>

      {/* Double rule */}
      <div className="double-rule mb-4" />

      {/* Title */}
      <div className="text-center mb-3">
        <h1 className="font-fraktur text-[clamp(4rem,12vw,9rem)] leading-none tracking-tight text-ink">
          Pace
        </h1>
      </div>

      {/* Tagline */}
      <div className="text-center mb-3">
        <p className="font-baskerville text-xs italic tracking-[0.2em] text-ink/70 uppercase">
          5 minutes a day.&ensp;One thing to build.&ensp;Never fall behind.
        </p>
      </div>

      {/* Bottom double rule */}
      <div className="double-rule" />
    </header>
  );
}
