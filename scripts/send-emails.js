(async () => {
  const isTest = process.argv.includes('--test');
  const TEST_EMAIL = 'veerakrisha123@gmail.com';

  const url = isTest
    ? `http://localhost:3000/api/email/send?testEmail=${encodeURIComponent(TEST_EMAIL)}`
    : 'http://localhost:3000/api/email/send';

  if (isTest) console.log(`[test mode] sending to ${TEST_EMAIL} only`);

  const res = await fetch(url, {
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
