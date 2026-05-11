import { supabase } from '@/app/lib/supabase';
import { Resend } from 'resend';

const VALID_CATEGORIES = ['coder', 'data-science', 'ui-ux'];
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CATEGORY_LABELS = {
  'coder': 'Coder',
  'data-science': 'Data Science',
  'ui-ux': 'UI/UX',
};

const resend = new Resend(process.env.RESEND_API_KEY);

function buildWelcomeEmail(category) {
  const label = CATEGORY_LABELS[category];
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Georgia,serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f0e8;padding:48px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#f5f0e8;max-width:560px;width:100%;">

          <!-- Masthead -->
          <tr>
            <td style="padding:0 0 4px 0;">
              <p style="margin:0;font-family:Georgia,serif;font-size:52px;font-weight:700;color:#1a1a1a;letter-spacing:-1px;line-height:1;">Pace</p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 0 32px 0;border-bottom:3px double #1a1a1a;">
              <p style="margin:0;font-family:'Courier New',monospace;font-size:9px;text-transform:uppercase;letter-spacing:3px;color:#888;">AI News · Daily Briefing</p>
            </td>
          </tr>

          <!-- Headline -->
          <tr>
            <td style="padding:36px 0 20px 0;">
              <h1 style="margin:0;font-family:Georgia,serif;font-size:28px;font-weight:700;color:#1a1a1a;line-height:1.2;">Welcome to Pace.</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:0 0 20px 0;">
              <p style="margin:0;font-family:Georgia,serif;font-size:16px;color:#333;line-height:1.7;">
                Every morning you&rsquo;ll get 3 AI stories that actually matter, decoded for your track
                (<span style="font-style:italic;color:#1a1a1a;">${label}</span>),
                with one thing to build.
              </p>
            </td>
          </tr>

          <!-- Tomorrow line -->
          <tr>
            <td style="padding:0 0 40px 0;">
              <p style="margin:0;font-family:Georgia,serif;font-size:16px;color:#333;line-height:1.7;">
                Your first brief lands tomorrow at 8am.
              </p>
            </td>
          </tr>

          <!-- Rule -->
          <tr>
            <td style="padding:0 0 24px 0;border-top:1px solid #ccc;"></td>
          </tr>

          <!-- Sign-off -->
          <tr>
            <td>
              <p style="margin:0;font-family:Georgia,serif;font-size:14px;color:#666;font-style:italic;">&mdash; The Pace Team</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { email, category } = body;

  if (!email || !EMAIL_REGEX.test(email)) {
    return Response.json({ error: 'Please provide a valid email address' }, { status: 400 });
  }

  if (!category || !VALID_CATEGORIES.includes(category)) {
    return Response.json(
      { error: `Category must be one of: ${VALID_CATEGORIES.join(', ')}` },
      { status: 400 }
    );
  }

  const { error: dbError } = await supabase
    .from('subscribers')
    .insert({ email, category });

  if (dbError) {
    if (dbError.code === '23505') {
      return Response.json({ error: "You're already subscribed!" }, { status: 409 });
    }
    console.error('Supabase insert error:', dbError);
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }

  const { error: emailError } = await resend.emails.send({
    from: 'Pace <onboarding@resend.dev>',
    to: email,
    subject: "You're on Pace — see you tomorrow",
    html: buildWelcomeEmail(category),
  });

  if (emailError) {
    console.error('Resend error:', emailError);
  }

  return Response.json({ success: true }, { status: 201 });
}
