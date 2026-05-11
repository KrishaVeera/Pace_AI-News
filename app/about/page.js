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
        <div className="max-w-2xl mx-auto px-6 py-12">
          {/* Body */}
          <div className="space-y-6">
            <p className="font-baskerville text-sm leading-[1.9] text-ink drop-cap">
              Pace is a daily AI news briefing built for students and new grads
              who want to stay ahead without feeling overwhelmed.
            </p>
            <p className="font-baskerville text-sm leading-[1.9] text-ink">
              Every morning, we scan the AI landscape, cut through the noise,
              and deliver three stories that actually matter — decoded for your
              track, with one thing to build.
            </p>
            <p className="font-baskerville text-sm leading-[1.9] text-ink">
              No doom. No hype. Just signal and action.
            </p>
            <p className="font-baskerville text-sm leading-[1.9] text-ink">
              Built by a student, for students. Because the best way to keep
              pace with the AI world is to build something with it every day.
            </p>
          </div>

          {/* Attribution */}
          <div className="mt-12 pt-6 border-t border-ink/20">
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
      </div>

      <Footer date={displayDate} issue="—" />
    </div>
  );
}
