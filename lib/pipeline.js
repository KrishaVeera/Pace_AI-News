import Parser from 'rss-parser';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const PARSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (compatible; PaceBot/1.0)',
  'Accept': 'application/rss+xml, application/xml, text/xml',
};

const parser = new Parser({ timeout: 15000, headers: PARSER_HEADERS });

const FEEDS = [
  { url: 'https://hnrss.org/frontpage?points=100',                          source: 'Hacker News',    timeout: 15000 },
  { url: 'https://openai.com/blog/rss.xml',                                  source: 'OpenAI'          },
  { url: 'https://www.anthropic.com/news/rss.xml',                           source: 'Anthropic'       },
  { url: 'https://techcrunch.com/category/artificial-intelligence/feed/',    source: 'TechCrunch'      },
  { url: 'https://venturebeat.com/category/ai/feed/',                        source: 'VentureBeat'     },
  { url: 'https://www.technologyreview.com/feed/',                           source: 'MIT Tech Review', filterAI: true },
  { url: 'https://stackoverflow.blog/feed/',                                 source: 'Stack Overflow',  filterAI: true },
  { url: 'https://dev.to/feed/tag/ai',                                       source: 'Dev.to'           },
  { url: 'https://www.oreilly.com/radar/feed/index.xml',                     source: "O'Reilly Radar",  filterAI: true },
];

const AI_KEYWORDS =
  /\b(ai|llm|gpt|claude|gemini|openai|anthropic|model|agent)\b|artificial intelligence|machine learning/i;

const MS_24H = 24 * 60 * 60 * 1000;
const MS_7D  =  7 * 24 * 60 * 60 * 1000;

function isWithin(pubDate, windowMs) {
  if (!pubDate) return false;
  const ts = new Date(pubDate).getTime();
  return !isNaN(ts) && Date.now() - ts <= windowMs;
}

function matchesAI(item) {
  return (
    AI_KEYWORDS.test(item.title || '') ||
    AI_KEYWORDS.test(item.contentSnippet || '') ||
    AI_KEYWORDS.test(item.content || '')
  );
}

function toArticle(item, source, isFallback = false) {
  return {
    title:   item.title?.trim() ?? '(no title)',
    summary: item.contentSnippet?.trim() || item.content?.trim() || '',
    source,
    url:     item.link ?? item.guid ?? '',
    pubDate: item.pubDate ?? item.isoDate ?? null,
    ...(isFallback && { isFallback: true }),
  };
}

async function fetchFeed({ url, source, filterAI = false, timeout }) {
  try {
    const p = timeout ? new Parser({ timeout, headers: PARSER_HEADERS }) : parser;
    const feed = await p.parseURL(url);
    const items = filterAI ? feed.items.filter(matchesAI) : feed.items;
    return { items, source };
  } catch (err) {
    console.error(`Failed to fetch feed [${source}]:`, err.message);
    return { items: [], source };
  }
}

export async function fetchArticles() {
  const results = await Promise.allSettled(FEEDS.map(fetchFeed));

  const allItems = results.flatMap((r) =>
    r.status === 'fulfilled'
      ? r.value.items.map((item) => ({ item, source: r.value.source }))
      : []
  );

  const fresh = allItems
    .filter(({ item }) => isWithin(item.pubDate, MS_24H))
    .map(({ item, source }) => toArticle(item, source));

  if (fresh.length >= 3) return fresh;

  const fallback = allItems
    .filter(({ item }) => isWithin(item.pubDate, MS_7D) && !isWithin(item.pubDate, MS_24H))
    .map(({ item, source }) => toArticle(item, source, true));

  return [...fresh, ...fallback];
}

// ─── Claude content generation ───────────────────────────────────────────────

const SYSTEM_PROMPT = `You are the editor of Pace, a daily AI news briefing for university students and new graduates who are anxious about the AI world but want to stay ahead. Your job is to select the 3 most relevant stories and generate content for the web app and email.

Respond ONLY with valid JSON, no markdown, no backticks.`;

function buildUserPrompt(articles) {
  const list = articles
    .map((a, i) =>
      `${i + 1}. ${a.title} (${a.source})\nURL: ${a.url || ''}\nSummary: ${a.summary || 'No summary available.'}`
    )
    .join('\n\n');

  return `From the following articles, select the 3 most actionable and relevant for a student or new grad learning to code or starting their career in tech.

Ignore: AI safety debates, stock/funding news, enterprise B2B deals, pure research papers with no usable tool.
Prioritize: new tools they can use today, free APIs, skill shifts affecting entry-level jobs.

Articles:
${list}

For the decodes and drops, assign ONE primary story per category — whichever of the 3 is most relevant to that track. The decode should focus on that one story and what it specifically means for someone in that field. Don't try to reference all 3 stories in every decode.

Rules:
- Coder decode → pick the story most relevant to building or coding
- Data Science decode → pick the story most relevant to data, models, or pipelines
- UI/UX decode → pick the story most relevant to design, interfaces, or visual tools
- If two categories share the same most-relevant story that's fine, just make the decode angle different
- The Drop should always match the story chosen for that category's decode

Return this exact JSON structure:
{
  "stories": [
    {
      "number": 1,
      "headline": "string",
      "summary": "string (2-3 sentences, plain English, no jargon)",
      "url": "string (copy the exact URL from the matching article above; use empty string if not available)"
    }
  ],
  "decodes": {
    "coder": "string (2-3 sentences focused on ONE story, what it specifically means for a developer)",
    "dataScience": "string (2-3 sentences focused on ONE story, what it means for a data science student)",
    "uiUx": "string (2-3 sentences focused on ONE story, what it means for a UI/UX student)"
  },
  "drops": {
    "coder": {
      "tool": "string",
      "stack": "string",
      "prompt": "string (starter prompt they paste into Claude/ChatGPT to begin building — see rules below)"
    },
    "dataScience": {
      "tool": "string",
      "stack": "string",
      "prompt": "string"
    },
    "uiUx": {
      "tool": "string",
      "stack": "string",
      "prompt": "string"
    }
  }
}

Rules for generating drops:
- The project must be something a student would genuinely want in their portfolio
- Never assume the user has external files, datasets, or resources (no "I have an MP3 file", no "I have a CSV", no "using your existing data")
- The project should be startable from zero with just an API key or free tool
- Keep the scope to something completable in 20-30 mins
- The starter prompt should be fully self-contained — someone with no context should be able to paste it directly into Claude and get started immediately
- Avoid overly niche or specific project ideas — prefer projects that are broadly useful or impressive to show to a recruiter`;
}

export async function generateDailyContent(articles) {
  console.log('[generateDailyContent] ANTHROPIC_API_KEY present:', !!process.env.ANTHROPIC_API_KEY);
  console.log('[generateDailyContent] article count passed to Claude:', articles.length);
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-5',
    max_tokens: 2048,
    system: [
      {
        type: 'text',
        text: SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      {
        role: 'user',
        content: buildUserPrompt(articles),
      },
    ],
  });

  try {
    const rawText = response.content[0].text;
    const cleaned = rawText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```\s*$/i, '')
      .trim();
    const parsed = JSON.parse(cleaned);
    return parsed;
  } catch (err) {
    console.error('Claude returned invalid JSON:', err.message);
    console.error('Raw response:', response.content[0]?.text);
    throw new Error('generateDailyContent: failed to parse Claude response');
  }
}
