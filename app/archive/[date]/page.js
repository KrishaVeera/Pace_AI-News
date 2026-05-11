import { supabase } from "@/app/lib/supabase";
import TickerBar from "@/app/components/TickerBar";
import Masthead from "@/app/components/Masthead";
import NavBar from "@/app/components/NavBar";
import TodaysBrief from "@/app/components/TodaysBrief";
import WIIFYSection from "@/app/components/WIIFYSection";
import TodaysDrop from "@/app/components/TodaysDrop";
import Footer from "@/app/components/Footer";
import Link from "next/link";

function formatDisplayDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function ArchiveDatePage({ params }) {
  const { date } = params;
  const displayDate = formatDisplayDate(date);

  const { data } = await supabase
    .from("daily_content")
    .select("stories, decodes, drops")
    .eq("date", date)
    .maybeSingle();

  if (!data) {
    return (
      <div className="min-h-screen bg-paper text-ink">
        <TickerBar date={displayDate} />
        <Masthead date={displayDate} />
        <div className="h-px bg-accent w-full" />
        <NavBar />
        <div className="max-w-6xl mx-auto px-6 py-24 text-center">
          <p className="font-playfair text-2xl text-ink/40 mb-6">
            Edition not found
          </p>
          <Link
            href="/archive"
            className="font-mono text-[10px] uppercase tracking-widest text-accent hover:underline"
          >
            ← Back to Archive
          </Link>
        </div>
        <Footer date={displayDate} issue="—" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <TickerBar date={displayDate} />
      <Masthead date={displayDate} />
      <div className="h-px bg-accent w-full" />
      <NavBar />

      <div className="bg-paper">
        {/* Back link */}
        <div className="max-w-6xl mx-auto px-6 pt-6">
          <Link
            href="/archive"
            className="font-mono text-[10px] uppercase tracking-widest text-accent hover:underline"
          >
            ← Back to Archive
          </Link>
        </div>

        {/* Date header */}
        <div className="max-w-6xl mx-auto px-6 pt-4">
          <div className="single-rule mb-2" />
          <p className="font-playfair text-[10px] uppercase tracking-[0.35em] text-ink/50 text-center">
            {displayDate}
          </p>
          <div className="single-rule mt-2" />
        </div>

        {/* Stories */}
        <div className="max-w-6xl mx-auto">
          <TodaysBrief stories={data.stories} />
        </div>

        {/* Double rule */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="border-t-[3px] border-double border-ink my-0" />
        </div>

        {/* WIIFY */}
        <div className="max-w-6xl mx-auto">
          <WIIFYSection decodes={data.decodes} />
        </div>

        {/* Single rule */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="single-rule" />
        </div>

        {/* Drop */}
        <div className="max-w-6xl mx-auto">
          <TodaysDrop drops={data.drops} />
        </div>
      </div>

      <Footer date={displayDate} issue="—" />
    </div>
  );
}
