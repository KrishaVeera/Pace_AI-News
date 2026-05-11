(async () => {
  const res = await fetch('http://localhost:3000/api/pipeline/run', {
    method: 'POST',
    headers: {
      'x-pipeline-secret': 'mysecretkey123',
    },
  });

  const data = await res.json();

  console.log('Status:', res.status);
  console.log('Response:', JSON.stringify(data, null, 2));

  if (!res.ok) {
    process.exit(1);
  }
})();
