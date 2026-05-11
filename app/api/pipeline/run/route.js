import { fetchArticles, generateDailyContent } from '@/lib/pipeline';
import { supabase } from '@/app/lib/supabase';

function today() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export async function POST(request) {
  const secret = request.headers.get('x-pipeline-secret');
  if (!secret || secret !== process.env.PIPELINE_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const date = today();

  const { data: cached, error: cacheError } = await supabase
    .from('daily_content')
    .select('stories')
    .eq('date', date)
    .maybeSingle();

  if (cacheError) {
    console.error('Supabase cache check error:', cacheError);
    return Response.json({ error: 'Database read failed' }, { status: 500 });
  }

  if (cached?.stories?.length) {
    return Response.json({ success: true, date, cached: true }, { status: 200 });
  }

  console.log('[pipeline] ANTHROPIC_API_KEY present:', !!process.env.ANTHROPIC_API_KEY);

  let articles;
  try {
    articles = await fetchArticles();
    console.log('[pipeline] articles fetched from RSS:', articles.length);
  } catch (err) {
    console.error('fetchArticles failed:', err);
    return Response.json({ error: 'Failed to fetch RSS articles' }, { status: 502 });
  }

  let content;
  try {
    content = await generateDailyContent(articles);
  } catch (err) {
    console.error('generateDailyContent failed — message:', err.message);
    console.error('generateDailyContent failed — status:', err.status ?? err.statusCode ?? 'n/a');
    console.error('generateDailyContent failed — full error:', err);
    return Response.json({ error: 'Failed to generate content from Claude' }, { status: 502 });
  }

  const { data: existing, error: selectError } = await supabase
    .from('daily_content')
    .select('id')
    .eq('date', date)
    .maybeSingle();

  if (selectError) {
    console.error('Supabase select error:', selectError);
    return Response.json({ error: 'Database read failed' }, { status: 500 });
  }

  const payload = {
    date,
    stories: content.stories,
    decodes: content.decodes,
    drops:   content.drops,
  };

  let dbError;

  if (existing) {
    ({ error: dbError } = await supabase
      .from('daily_content')
      .update(payload)
      .eq('id', existing.id));
  } else {
    ({ error: dbError } = await supabase
      .from('daily_content')
      .insert(payload));
  }

  if (dbError) {
    console.error('Supabase write error:', dbError);
    return Response.json({ error: 'Database write failed' }, { status: 500 });
  }

  return Response.json({ success: true, date }, { status: 200 });
}
