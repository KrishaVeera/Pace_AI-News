import { Resend } from 'resend';
import { supabase } from '@/app/lib/supabase';
import { buildDailyEmail } from '@/lib/emailTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);

function today() {
  return new Date().toISOString().slice(0, 10);
}

function formatDateLong(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day).toLocaleDateString('en-US', {
    weekday: 'long',
    month:   'long',
    day:     'numeric',
  });
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function POST(request) {
  const secret = request.headers.get('x-pipeline-secret');
  if (!secret || secret !== process.env.PIPELINE_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const date = today();

  // Fetch today's content
  const { data: contentRow, error: contentError } = await supabase
    .from('daily_content')
    .select('stories, decodes, drops')
    .eq('date', date)
    .maybeSingle();

  if (contentError) {
    console.error('Supabase content fetch error:', contentError);
    return Response.json({ error: 'Database read failed' }, { status: 500 });
  }

  if (!contentRow) {
    return Response.json(
      { error: 'No content found for today — run the pipeline first' },
      { status: 404 }
    );
  }

  // Fetch all subscribers
  const { data: subscribers, error: subError } = await supabase
    .from('subscribers')
    .select('email, category');

  if (subError) {
    console.error('Supabase subscribers fetch error:', subError);
    return Response.json({ error: 'Failed to fetch subscribers' }, { status: 500 });
  }

  // Group by category
  const groups = { coders: [], dataScience: [], uiUx: [] };
  for (const sub of subscribers) {
    if (sub.category === 'coder')        groups.coders.push(sub);
    else if (sub.category === 'data-science') groups.dataScience.push(sub);
    else if (sub.category === 'ui-ux')   groups.uiUx.push(sub);
  }

  const subject = `Your Pace Brief — ${formatDateLong(date)}`;
  let sent = 0;

  // Send to all subscribers, one at a time with a delay
  for (const sub of subscribers) {
    try {
      const html = buildDailyEmail(sub.category, contentRow);
      await resend.emails.send({
        from:    'Pace <onboarding@resend.dev>',
        to:      sub.email,
        subject,
        html,
      });
      sent++;
    } catch (err) {
      console.error(`Failed to send to ${sub.email}:`, err.message ?? err);
    }
    await sleep(100);
  }

  return Response.json({
    success: true,
    sent,
    breakdown: {
      coders:      groups.coders.length,
      dataScience: groups.dataScience.length,
      uiUx:        groups.uiUx.length,
    },
  });
}
