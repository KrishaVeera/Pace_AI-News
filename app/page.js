export const dynamic = 'force-dynamic';

import { supabase } from "@/app/lib/supabase";
import TickerBar from "./components/TickerBar";
import Masthead from "./components/Masthead";
import NavBar from "./components/NavBar";
import TodaysBrief from "./components/TodaysBrief";
import WIIFYSection from "./components/WIIFYSection";
import TodaysDrop from "./components/TodaysDrop";
import Footer from "./components/Footer";

export default async function Home() {
  const now = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
  const today = new Date(now);
  const dateStr = today.toISOString().split('T')[0];
  const displayDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const { data, error } = await supabase
    .from("daily_content")
    .select("stories, decodes, drops")
    .eq("date", dateStr)
    .maybeSingle();

  console.log("[daily_content] queried date:", dateStr);
  console.log("[daily_content] data:", JSON.stringify(data, null, 2));
  if (error) console.error("[daily_content] error:", error);

  const stories = data?.stories ?? null;
  const decodes = data?.decodes ?? null;
  const drops   = data?.drops   ?? null;

  return (
    <div className="min-h-screen bg-paper text-ink">
      <TickerBar date={displayDate} stories={stories} />
      <Masthead date={displayDate} />
      <div className="h-px bg-accent w-full" />
      <NavBar />

      <div className="bg-paper">
        <div className="max-w-6xl mx-auto">
          <TodaysBrief stories={stories} />
        </div>
        <div className="max-w-6xl mx-auto px-6">
          <div className="border-t-[3px] border-double border-ink my-0" />
        </div>
        <div className="max-w-6xl mx-auto">
          <WIIFYSection decodes={decodes} />
        </div>
        <div className="max-w-6xl mx-auto px-6">
          <div className="single-rule" />
        </div>
        <div className="max-w-6xl mx-auto">
          <TodaysDrop drops={drops} />
        </div>
      </div>

      <Footer date={displayDate} issue="—" />
    </div>
  );
}
