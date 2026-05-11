import { supabase } from "@/app/lib/supabase";
import TickerBar from "./components/TickerBar";
import Masthead from "./components/Masthead";
import NavBar from "./components/NavBar";
import TodaysBrief from "./components/TodaysBrief";
import WIIFYSection from "./components/WIIFYSection";
import TodaysDrop from "./components/TodaysDrop";
import Footer from "./components/Footer";

const DATE = "Tuesday, April 22, 2026";
const ISSUE = "42";

export default async function Home() {
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("daily_content")
    .select("stories, decodes, drops")
    .eq("date", today)
    .maybeSingle();

  console.log("[daily_content] queried date:", today);
  console.log("[daily_content] data:", JSON.stringify(data, null, 2));
  if (error) console.error("[daily_content] error:", error);

  const stories = data?.stories ?? null;
  const decodes = data?.decodes ?? null;
  const drops   = data?.drops   ?? null;

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* 1 · Ticker */}
      <TickerBar date={DATE} />

      {/* 2 · Masthead */}
      <Masthead date={DATE} issue={ISSUE} />

      {/* Thin red rule between masthead and nav */}
      <div className="h-px bg-accent w-full" />

      {/* 3 · Nav */}
      <NavBar />

      {/* Paper body */}
      <div className="bg-paper">
        {/* 4 · Today's Brief */}
        <div className="max-w-6xl mx-auto">
          <TodaysBrief stories={stories} />
        </div>

        {/* 5 · Divider rule */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="border-t-[3px] border-double border-ink my-0" />
        </div>

        {/* 6 · WIIFY */}
        <div className="max-w-6xl mx-auto">
          <WIIFYSection decodes={decodes} />
        </div>

        {/* Thin rule */}
        <div className="max-w-6xl mx-auto px-6">
          <div className="single-rule" />
        </div>

        {/* 7 · Today's Drop */}
        <div className="max-w-6xl mx-auto">
          <TodaysDrop drops={drops} />
        </div>
      </div>

      {/* 8 · Footer */}
      <Footer date={DATE} issue={ISSUE} />
    </div>
  );
}
