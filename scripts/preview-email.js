import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import { buildDailyEmail } from '../lib/emailTemplate.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  try {
    const text = readFileSync(join(__dirname, '../.env.local'), 'utf8');
    for (const line of text.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eq = trimmed.indexOf('=');
      if (eq === -1) continue;
      const key = trimmed.slice(0, eq).trim();
      const val = trimmed.slice(eq + 1).trim();
      if (!process.env[key]) process.env[key] = val;
    }
  } catch {
    // .env.local not found — rely on existing env vars
  }
}

(async () => {
  loadEnv();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  console.log('Fetching most recent content...');

  const res = await fetch(
    `${url}/rest/v1/daily_content?select=*&order=date.desc&limit=1`,
    {
      headers: {
        apikey:        key,
        Authorization: `Bearer ${key}`,
      },
    },
  );

  if (!res.ok) {
    console.error(`Supabase error: ${res.status} ${res.statusText}`);
    process.exit(1);
  }

  const rows = await res.json();
  const data = rows[0] ?? null;

  if (!data) {
    console.error('No content found — run the pipeline first.');
    process.exit(1);
  }

  console.log(`Using content from ${data.date}`);

  const html = buildDailyEmail('coder', data);
  const outPath = join(__dirname, '../email-preview.html');
  writeFileSync(outPath, html, 'utf8');
  console.log(`Preview saved → email-preview.html`);
})();
