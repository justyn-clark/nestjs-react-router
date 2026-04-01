const baseUrl = process.env.SMOKE_BASE_URL || 'http://localhost:3000';

async function main() {
  const health = await fetch(`${baseUrl}/api/health`);
  if (!health.ok) {
    throw new Error(`Health check failed with ${health.status}`);
  }

  const healthPayload = await health.json();
  if (!healthPayload.services?.redis || !healthPayload.services?.postgres) {
    throw new Error('Health payload is missing service details');
  }

  const contact = await fetch(`${baseUrl}/api/contact`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: 'smoke@example.com',
      name: 'Smoke Test',
      message: 'Smoke-testing the starter contact submission flow.',
    }),
  });

  if (contact.status !== 201) {
    throw new Error(`Contact submission failed with ${contact.status}`);
  }

  console.log(`Smoke test passed against ${baseUrl}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
