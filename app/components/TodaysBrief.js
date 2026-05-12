const FALLBACK_STORIES = [
  {
    number: 1,
    headline: "Gemini 3.1 Drops With 2M Token Context Window",
    summary:
      "Google's latest model can now read an entire codebase in one go and run code mid-conversation. Free API access via Google AI Studio.",
  },
  {
    number: 2,
    headline: "OpenAI Shuts Down Sora After 6 Months",
    summary:
      "The video app burned $15M/day with almost no revenue. A reminder that distribution without use case is worthless — and the video AI space just opened up.",
  },
  {
    number: 3,
    headline: "Claude Opus 4.7 Launches for Agent Workflows",
    summary:
      "Anthropic's newest model is built for tasks that run over hours, not seconds. The agentic app wave is becoming real and hireable.",
  },
];

export default function TodaysBrief({ stories }) {
  const activeStories = stories?.length ? stories : FALLBACK_STORIES;

  return (
    <section className="bg-paper px-6 py-6 max-w-6xl mx-auto">
      {/* Section header */}
      <div className="mb-4">
        <div className="single-rule mb-2" />
        <h2 className="font-playfair text-[10px] uppercase tracking-[0.35em] text-ink/50 text-center">
          Today&rsquo;s Brief
        </h2>
        <div className="single-rule mt-2" />
      </div>

      {/* Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-ink/25">
        {activeStories.map((story, i) => (
          <article
            key={i}
            className={`px-0 md:px-5 py-4 md:py-0 ${i === 0 ? "md:pl-0" : ""} ${i === activeStories.length - 1 ? "md:pr-0" : ""}`}
          >
            {/* Story number */}
            <span className="font-mono text-[10px] text-accent tracking-widest uppercase block mb-2">
              Story {story.number}
            </span>

            {/* Headline */}
            <h3 className="font-playfair font-bold text-xl leading-tight text-ink mb-3">
              {story.headline}
            </h3>

            {/* Rule */}
            <div className="w-8 border-t-2 border-ink mb-3" />

            {/* Summary */}
            <p className="font-baskerville text-sm leading-relaxed text-ink/80">
              {story.summary}
            </p>

            {/* Read more */}
            {story.url && (
              <a
                href={story.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block font-mono text-[10px] uppercase tracking-widest text-accent hover:underline"
              >
                Read more →
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
