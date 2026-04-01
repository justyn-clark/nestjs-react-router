const baseUrl = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:3000';

async function assertOk(response, label) {
  if (!response.ok) {
    throw new Error(`${label} failed with ${response.status}`);
  }
}

async function main() {
  const home = await fetch(`${baseUrl}/`);
  await assertOk(home, 'home page');
  const homeHtml = await home.text();
  if (!homeHtml.includes('NestJS React Router')) {
    throw new Error('home page did not render expected shell');
  }

  const health = await fetch(`${baseUrl}/api/health`);
  await assertOk(health, 'health endpoint');
  const healthJson = await health.json();
  if (!healthJson.services?.redis?.ok || !healthJson.services?.postgres?.ok) {
    throw new Error('health endpoint did not report redis + postgres healthy');
  }

  const contact = await fetch(`${baseUrl}/api/contact`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      email: 'e2e@example.com',
      name: 'E2E Smoke',
      message: 'Verifying starter behavior through the built application path.',
    }),
  });
  if (contact.status !== 201) {
    throw new Error(`contact submission failed with ${contact.status}`);
  }

  const cookieJar = [];
  const login = await fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'e2e@example.com' }),
  });
  await assertOk(login, 'login endpoint');
  const setCookie = login.headers.get('set-cookie');
  if (setCookie) {
    cookieJar.push(setCookie.split(';')[0]);
  }

  const dashboard = await fetch(`${baseUrl}/dashboard`, {
    headers: cookieJar.length ? { cookie: cookieJar.join('; ') } : {},
    redirect: 'manual',
  });

  if (dashboard.status === 302) {
    throw new Error('dashboard redirected even after login');
  }
  await assertOk(dashboard, 'dashboard page');
  const dashboardHtml = await dashboard.text();
  if (!dashboardHtml.includes('Dashboard') || !dashboardHtml.includes('e2e@example.com')) {
    throw new Error('dashboard did not render authenticated state');
  }

  console.log(`E2E smoke passed against ${baseUrl}`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
