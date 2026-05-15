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

          {/* Body */}
          <div className="space-y-6">
            <p className="font-baskerville text-sm leading-[1.9] text-ink italic">
              The news cycle moves fast. But reading about AI and actually being ready for it
              are two very different things.
            </p>
            <p className="font-baskerville text-sm leading-[1.9] text-ink">
              Most mornings, you can find a dozen headlines about the latest model release, the
              next wave of automation, the jobs being reshaped. You read them, feel vaguely
              anxious, and move on. Nothing sticks. Nothing changes.
            </p>
            <p className="font-baskerville text-sm leading-[1.9] text-ink">
              Pace was built for a different kind of morning.
            </p>
            <p className="font-baskerville text-sm leading-[1.9] text-ink">
              We believe students and new grads deserve more than just information &mdash; they
              deserve context. Not just what happened, but what it means for them, and what they
              can do about it today. Three stories. A decode for your track. One thing to build.
            </p>
            <p className="font-baskerville text-sm leading-[1.9] text-ink">
              Because the best way to stop feeling behind is to start building forward.
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
