import { supabase } from "@/app/lib/supabase";
import TickerBar from "@/app/components/TickerBar";
import Masthead from "@/app/components/Masthead";
import NavBar from "@/app/components/NavBar";
import Footer from "@/app/components/Footer";
import Link from "next/link";

function formatCardDate(dateStr) {
  const [y, m, d] = dateStr.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  return {
    dayName: dt.toLocaleDateString("en-US", { weekday: "long" }),
    fullDate: dt.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
  };
}

export default async function ArchivePage() {
  const displayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const { data } = await supabase
    .from("daily_content")
    .select("date, stories")
    .order("date", { ascending: false });

  const displayRows = data ?? [];

  return (
    <div className="min-h-screen bg-paper text-ink">
      <TickerBar date={displayDate} />
      <Masthead date={displayDate} />
      <div className="h-px bg-accent w-full" />
      <NavBar />

      <div className="bg-paper">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {displayRows.length === 0 ? (
            <p className="font-baskerville text-sm text-ink/50 text-center py-16">
              No editions available yet.
            </p>
          ) : (
            <div className="divide-y divide-ink/20">
              {displayRows.map((row) => {
                const { dayName, fullDate } = formatCardDate(row.date);
                const headlines = (row.stories ?? []).slice(0, 3);
                return (
                  <Link
                    key={row.date}
                    href={`/archive/${row.date}`}
                    className="block group"
                  >
                    <div className="py-5 flex items-start justify-between gap-6 -mx-3 px-3 hover:bg-ink/[0.025] transition-colors rounded-sm">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-baseline gap-2 mb-3">
                          <span className="font-playfair font-bold text-base text-ink">
                            {dayName}
                          </span>
                          <span className="font-mono text-[10px] text-ink/45 uppercase tracking-widest">
                            {fullDate}
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          {headlines.map((story, i) => (
                            <div key={i} className="flex items-start gap-2.5">
                              <span className="font-mono text-[10px] text-accent font-bold shrink-0 pt-px">
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <span className="font-baskerville text-sm text-ink/85 leading-snug">
                                {story.headline}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="shrink-0 self-center">
                        <span className="font-mono text-base text-accent group-hover:translate-x-0.5 inline-block transition-transform">
                          →
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <Footer date={displayDate} issue="—" />
    </div>
  );
}
