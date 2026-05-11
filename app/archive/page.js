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

function isFreeEdition(dateStr, todayStr) {
  const [y1, m1, d1] = dateStr.split("-").map(Number);
  const [y2, m2, d2] = todayStr.split("-").map(Number);
  const diffDays =
    (new Date(y2, m2 - 1, d2) - new Date(y1, m1 - 1, d1)) / 86400000;
  return diffDays < 7;
}

function LockIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
    </svg>
  );
}

export default async function ArchivePage() {
  const todayStr = new Date().toISOString().slice(0, 10);
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

  const rows = data ?? [];

  return (
    <div className="min-h-screen bg-paper text-ink">
      <TickerBar date={displayDate} />
      <Masthead date={displayDate} />
      <div className="h-px bg-accent w-full" />
      <NavBar />

      <div className="bg-paper">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {rows.length === 0 ? (
            <p className="font-baskerville text-sm text-ink/50 text-center py-16">
              No editions available yet.
            </p>
          ) : (
            <div className="divide-y divide-ink/20">
              {rows.map((row) => {
                const free = isFreeEdition(row.date, todayStr);
                const { dayName, fullDate } = formatCardDate(row.date);
                const headlines = (row.stories ?? []).slice(0, 3);

                if (free) {
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
                }

                return (
                  <div
                    key={row.date}
                    className="py-5 flex items-start justify-between gap-6"
                    style={{ opacity: 0.55 }}
                  >
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
                            <span
                              className="font-baskerville text-sm text-ink/85 leading-snug select-none"
                              style={{ filter: "blur(3px)" }}
                            >
                              {story.headline}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="shrink-0 self-center flex items-center gap-2 text-ink/60">
                      <span className="font-mono text-[9px] uppercase tracking-widest border border-ink/40 px-1.5 py-0.5">
                        Pro
                      </span>
                      <LockIcon />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pro banner */}
          <div className="mt-12 bg-ink text-paper px-6 py-5 text-center">
            <p className="font-baskerville text-sm italic leading-relaxed">
              Unlock full archive with Pace Pro
              <span className="mx-2 text-paper/30">·</span>
              <span className="font-mono text-[10px] uppercase tracking-widest not-italic text-paper/65">
                Coming soon · $6/month
              </span>
            </p>
          </div>
        </div>
      </div>

      <Footer date={displayDate} issue="—" />
    </div>
  );
}
