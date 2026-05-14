import TickerBar from "@/app/components/TickerBar";
import Masthead from "@/app/components/Masthead";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";

export default function AboutPage() {
  const displayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-paper text-ink">
      <TickerBar date={displayDate} />
      <Masthead date={displayDate} />
      <div className="h-px bg-accent w-full" />
      <NavBar />

      <div className="bg-paper">
        <div className="max-w-[680px] mx-auto px-6 py-12">

          {/* Headline */}
          <div className="mb-10">
            <div className="single-rule mb-2" />
            <h1 className="font-playfair font-bold text-3xl leading-tight text-ink text-center">
              About Pace
            </h1>
            <div className="single-rule mt-4" />
          </div>

          {/* Body */}
          <div className="space-y-6">
            <p className="font-baskerville text-sm leading-[1.9] text-ink drop-cap">
              Most AI news is written for investors and executives. Pace is written for you.
            </p>
            <p className="font-baskerville text-sm leading-[1.9] text-ink">
              The AI world is changing faster than anyone can keep up with — and if you&rsquo;re
              a student or new grad, that anxiety is real. Which tools actually matter? Which
              skills are becoming more valuable? What&rsquo;s hype and what&rsquo;s not?
            </p>
            <p className="font-baskerville text-sm leading-[1.9] text-ink">
              Pace cuts through the noise every morning in under 5 minutes. Three stories that
              actually matter, decoded for your track — whether you&rsquo;re building, analyzing
              data, or designing. Plus one concrete project prompt to start your day with
              something real.
            </p>
            <p className="font-baskerville text-sm leading-[1.9] text-ink">
              No doom. No hype. No 47-tab rabbit holes. Just what changed, why it matters to
              you, and what to build because of it.
            </p>
          </div>

          {/* Divider */}
          <div className="single-rule mt-10 mb-8" />

          {/* Attribution */}
          <p className="font-mono text-[10px] uppercase tracking-widest text-ink/50">
            —{" "}
            <a
              href="https://animated-english-93e.notion.site/Krisha-Veera-s-Project-Portfolio-d8df759e5a3843779be8e992922af5c2"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Built by Krisha Veera
            </a>
          </p>

        </div>
      </div>

      <Footer date={displayDate} issue="—" />
    </div>
  );
}
