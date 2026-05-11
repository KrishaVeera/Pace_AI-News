(async () => {
  const res = await fetch('http://localhost:3000/api/email/send', {
    method: 'POST',
    headers: {
      'x-pipeline-secret': 'mysecretkey123',
    },
  });

  const body = await res.json();

  console.log('Status:', res.status);
  console.log('Response:', JSON.stringify(body, null, 2));

  if (body.sent !== undefined) {
    console.log(`\nEmails sent: ${body.sent}`);
    console.log(`  Coders:          ${body.breakdown.coders}`);
    console.log(`  Data Scientists: ${body.breakdown.dataScience}`);
    console.log(`  UI/UX Designers: ${body.breakdown.uiUx}`);
  }
})();
