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

function formatDate(date = new Date()) {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year:    'numeric',
    month:   'long',
    day:     'numeric',
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function storyCell(story, index, padding, ACCENT, TEXT) {
  if (!story) return `<td class="story-col" style="vertical-align:top;padding:${padding};"></td>`;
  const url = story.url || '';
  const num = story.number ?? (index + 1);
  return `<td class="story-col" style="vertical-align:top;padding:${padding};">
      <p style="margin:0 0 6px 0;font-family:'Libre Baskerville',Georgia,serif;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:${ACCENT};">Story ${num}</p>
      <h2 style="margin:0 0 10px 0;font-family:'Playfair Display',Georgia,serif;font-size:19px;font-weight:700;color:${TEXT};line-height:1.3;">${escapeHtml(story.headline)}</h2>
      <div style="width:36px;height:1px;background-color:${ACCENT};margin:0 0 12px 0;"></div>
      <p style="margin:0 0 12px 0;font-family:'Libre Baskerville',Georgia,serif;font-size:13px;line-height:1.7;color:${TEXT};">${escapeHtml(story.summary)}</p>
      ${url ? `<a href="${url}" style="font-family:'Libre Baskerville',Georgia,serif;font-size:12px;color:${ACCENT};text-decoration:none;font-weight:700;">Read more &rarr;</a>` : ''}
    </td>`;
}

function dropCell(drop, categoryLabel, padding, ACCENT, TEXT, MUTED, BG) {
  if (!drop) return `<td class="drop-col" style="vertical-align:top;padding:${padding};"></td>`;
  return `<td class="drop-col" style="vertical-align:top;padding:${padding};">
      <p style="margin:0 0 12px 0;font-family:'Libre Baskerville',Georgia,serif;font-size:13px;font-weight:700;color:${ACCENT};text-transform:uppercase;letter-spacing:0.06em;">${escapeHtml(categoryLabel)}</p>
      <h3 style="margin:0 0 6px 0;font-family:'Playfair Display',Georgia,serif;font-size:17px;font-weight:700;color:${TEXT};line-height:1.3;">${escapeHtml(drop.tool ?? '')}</h3>
      <p style="margin:0 0 12px 0;font-family:'Libre Baskerville',Georgia,serif;font-size:11px;color:${MUTED};font-style:italic;">${escapeHtml(drop.stack ?? '')}</p>
      <div style="background-color:${TEXT};border-left:3px solid ${ACCENT};padding:12px 14px;margin-bottom:10px;">
        <p style="margin:0;font-family:'Courier New',Courier,monospace;font-size:11px;line-height:1.6;color:${BG};white-space:pre-wrap;">${escapeHtml(drop.prompt ?? '')}</p>
      </div>
      <p style="margin:0;font-family:'Libre Baskerville',Georgia,serif;font-size:11px;color:${MUTED};font-style:italic;">Copy this prompt into Claude or ChatGPT to get started</p>
    </td>`;
}

export function buildDailyEmail(category, content) {
  const label   = CATEGORY_LABEL[category] ?? category;
  const decode  = content.decodes[DECODE_KEY[category]] ?? '';
  const stories = content.stories ?? [];

  const BG     = '#f5f0e8';
  const TEXT   = '#1a1008';
  const ACCENT = '#c8102e';
  const MUTED  = '#6b5744';
  const BORDER = '#ddd5c8';

  const VDIV = `<td class="story-divider" style="width:1px;padding:0;background-color:${BORDER};"></td>`;

  const s1 = storyCell(stories[0], 0, '0 20px 0 0', ACCENT, TEXT);
  const s2 = storyCell(stories[1], 1, '0 20px',     ACCENT, TEXT);
  const s3 = storyCell(stories[2], 2, '0 0 0 20px', ACCENT, TEXT);

  const drop = content.drops?.[DECODE_KEY[category]];
  const d = dropCell(drop, `For ${label}`, '0', ACCENT, TEXT, MUTED, BG);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Pace — Daily AI Brief</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet">
  <style>
    @media only screen and (max-width:600px) {
      .story-col     { display:block !important; width:100% !important; padding:20px 0 !important; border-bottom:1px solid #ddd5c8 !important; }
      .story-divider { display:none  !important; }
      .drop-col      { display:block !important; width:100% !important; padding:20px 0 !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${BG};font-family:'Libre Baskerville',Georgia,serif;color:${TEXT};">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BG};">
    <tr>
      <td align="center" style="padding:40px 16px;">

        <table width="680" cellpadding="0" cellspacing="0" border="0" style="max-width:680px;width:100%;">

          <!-- HEADER -->
          <tr>
            <td style="padding:32px 0 28px 0;text-align:center;">
              <h1 style="margin:0 0 10px 0;font-family:'Playfair Display',Georgia,serif;font-size:72px;font-weight:900;letter-spacing:-0.02em;color:${TEXT};line-height:1;">Pace</h1>
              <p style="margin:0 0 8px 0;font-family:'Libre Baskerville',Georgia,serif;font-size:11px;letter-spacing:0.15em;text-transform:uppercase;color:${MUTED};">${formatDate()}</p>
              <p style="margin:0 0 24px 0;font-family:'Libre Baskerville',Georgia,serif;font-size:13px;font-style:italic;color:${MUTED};">5 minutes a day. One thing to build. Never fall behind.</p>
              <hr style="border:none;border-top:2px solid ${ACCENT};margin:0;" />
            </td>
          </tr>

          <!-- TODAY'S BRIEF -->
          <tr>
            <td style="padding:32px 0 0 0;">
              <p style="margin:0 0 24px 0;font-family:'Libre Baskerville',Georgia,serif;font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:${ACCENT};">Today&rsquo;s Brief</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>${s1}${VDIV}${s2}${VDIV}${s3}</tr>
              </table>
            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td style="padding:32px 0 0 0;">
              <hr style="border:none;border-top:1px solid ${BORDER};margin:0;" />
            </td>
          </tr>

          <!-- WHAT'S IN IT FOR YOU -->
          <tr>
            <td style="padding:28px 0 0 0;">
              <p style="margin:0 0 16px 0;font-family:'Libre Baskerville',Georgia,serif;font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:${ACCENT};">What&rsquo;s In It For You</p>
              <p style="margin:0 0 12px 0;font-family:'Libre Baskerville',Georgia,serif;font-size:13px;font-weight:700;color:${ACCENT};text-transform:uppercase;letter-spacing:0.06em;">For ${escapeHtml(label)}:</p>
              <p style="margin:0;font-family:'Libre Baskerville',Georgia,serif;font-size:15px;line-height:1.75;color:${TEXT};">${escapeHtml(decode)}</p>
            </td>
          </tr>

          <!-- DIVIDER -->
          <tr>
            <td style="padding:32px 0 0 0;">
              <hr style="border:none;border-top:1px solid ${BORDER};margin:0;" />
            </td>
          </tr>

          <!-- TODAY'S DROP -->
          <tr>
            <td style="padding:28px 0 0 0;">
              <p style="margin:0 0 24px 0;font-family:'Libre Baskerville',Georgia,serif;font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:${ACCENT};">Today&rsquo;s Drop</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>${d}</tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:40px 0 32px 0;">
              <hr style="border:none;border-top:1px solid ${ACCENT};margin:0 0 24px 0;" />
              <p style="margin:0 0 8px 0;font-family:'Libre Baskerville',Georgia,serif;font-size:11px;color:${MUTED};text-align:center;line-height:1.6;">You&rsquo;re receiving this because you subscribed to Pace. No spam, ever.</p>
              <p style="margin:0;font-family:'Libre Baskerville',Georgia,serif;font-size:11px;color:${MUTED};font-style:italic;text-align:center;">&mdash; The Pace Team</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>`;
}
