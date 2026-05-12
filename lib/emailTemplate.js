const CATEGORY_LABEL = {
  'coder':        'Coders',
  'data-science': 'Data Scientists',
  'ui-ux':        'UI/UX Designers',
};

const DECODE_KEY = {
  'coder':        'coder',
  'data-science': 'dataScience',
  'ui-ux':        'uiUx',
};

const DROP_KEY = {
  'coder':        'coder',
  'data-science': 'dataScience',
  'ui-ux':        'uiUx',
};

function formatDate(date = new Date()) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  });
}

export function buildDailyEmail(category, content) {
  const label    = CATEGORY_LABEL[category] ?? category;
  const decode   = content.decodes[DECODE_KEY[category]] ?? '';
  const drop     = content.drops[DROP_KEY[category]] ?? {};
  const stories  = content.stories ?? [];

  const BG      = '#f5f0e8';
  const TEXT    = '#1a1008';
  const ACCENT  = '#c8102e';
  const MUTED   = '#6b5744';
  const BORDER  = '#ddd5c8';
  const WHITE   = '#ffffff';

  const storiesHtml = stories.map((story, i) => {
    const url = story.url || '';
    return `
      <div style="margin-bottom:28px;">
        <p style="margin:0 0 4px 0; font-size:11px; font-weight:600; letter-spacing:0.08em; text-transform:uppercase; color:${ACCENT};">
          Story ${story.number ?? i + 1}
        </p>
        <h2 style="margin:0 0 8px 0; font-size:18px; font-weight:700; color:${TEXT}; line-height:1.35;">
          ${escapeHtml(story.headline)}
        </h2>
        <p style="margin:0 0 10px 0; font-size:15px; line-height:1.6; color:${TEXT};">
          ${escapeHtml(story.summary)}
        </p>
        ${url ? `<a href="${url}" style="font-size:14px; color:${ACCENT}; text-decoration:none; font-weight:600;">Read more &rarr;</a>` : ''}
      </div>`;
  }).join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pace — Daily AI Brief</title>
</head>
<body style="margin:0; padding:0; background-color:${BG}; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif; color:${TEXT};">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BG};">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%;">

          <!-- Header -->
          <tr>
            <td style="padding:0 0 40px 0; text-align:center; border-bottom:2px solid ${ACCENT};">
              <p style="margin:0 0 6px 0; font-size:42px; font-weight:800; letter-spacing:-0.02em; color:${TEXT};">
                Pace
              </p>
              <p style="margin:0 0 10px 0; font-size:14px; color:${MUTED};">
                ${formatDate()}
              </p>
              <p style="margin:0; font-size:13px; color:${MUTED}; font-style:italic;">
                5 minutes a day. One thing to build. Never fall behind.
              </p>
            </td>
          </tr>

          <!-- Today's Brief -->
          <tr>
            <td style="padding:36px 0 0 0;">
              <p style="margin:0 0 24px 0; font-size:11px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:${MUTED};">
                Today&rsquo;s Brief
              </p>
              ${storiesHtml}
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:12px 0;">
              <hr style="border:none; border-top:1px solid ${BORDER}; margin:0;" />
            </td>
          </tr>

          <!-- What's In It For You -->
          <tr>
            <td style="padding:24px 0 0 0;">
              <p style="margin:0 0 10px 0; font-size:11px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:${MUTED};">
                What&rsquo;s In It For You
              </p>
              <p style="margin:0 0 10px 0; font-size:13px; font-weight:700; color:${ACCENT}; text-transform:uppercase; letter-spacing:0.06em;">
                For ${escapeHtml(label)}:
              </p>
              <p style="margin:0; font-size:15px; line-height:1.7; color:${TEXT};">
                ${escapeHtml(decode)}
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:32px 0 12px 0;">
              <hr style="border:none; border-top:1px solid ${BORDER}; margin:0;" />
            </td>
          </tr>

          <!-- Today's Drop -->
          <tr>
            <td style="padding:12px 0 0 0;">
              <p style="margin:0 0 16px 0; font-size:11px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:${MUTED};">
                Today&rsquo;s Drop
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background-color:${WHITE}; border:1px solid ${BORDER}; border-radius:6px; padding:24px;">
                <tr>
                  <td style="padding:24px;">
                    <p style="margin:0 0 6px 0; font-size:13px; color:${MUTED}; text-transform:uppercase; letter-spacing:0.06em; font-weight:600;">
                      Tool
                    </p>
                    <p style="margin:0 0 18px 0; font-size:16px; font-weight:700; color:${TEXT};">
                      ${escapeHtml(drop.tool ?? '')}
                    </p>

                    <p style="margin:0 0 6px 0; font-size:13px; color:${MUTED}; text-transform:uppercase; letter-spacing:0.06em; font-weight:600;">
                      Stack
                    </p>
                    <p style="margin:0 0 18px 0; font-size:15px; color:${TEXT};">
                      ${escapeHtml(drop.stack ?? '')}
                    </p>

                    <p style="margin:0 0 8px 0; font-size:13px; color:${MUTED}; text-transform:uppercase; letter-spacing:0.06em; font-weight:600;">
                      Starter Prompt
                    </p>
                    <div style="background-color:${BG}; border-left:3px solid ${ACCENT}; padding:14px 16px; border-radius:0 4px 4px 0; margin-bottom:12px;">
                      <p style="margin:0; font-size:14px; line-height:1.65; color:${TEXT}; font-family:'Courier New',Courier,monospace; white-space:pre-wrap;">
${escapeHtml(drop.prompt ?? '')}</p>
                    </div>
                    <p style="margin:0; font-size:12px; color:${MUTED}; font-style:italic;">
                      Copy this prompt into Claude or ChatGPT to get started
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:48px 0 0 0; text-align:center; border-top:1px solid ${BORDER}; margin-top:40px;">
              <p style="margin:0; font-size:12px; color:${MUTED}; line-height:1.6;">
                You&rsquo;re receiving this because you subscribed to Pace. No spam, ever.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
