// Uses only a disposable Docker database and local processes. Never reads .env.
import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { createConnection } from 'node:net';
import { fileURLToPath } from 'node:url';

const frontend = fileURLToPath(new URL('../', import.meta.url));
const backend = fileURLToPath(new URL('../../yarok-be/', import.meta.url));
const container = `yarok-integration-${process.pid}`;
const processes = [];
const docker = args => {
  const result = spawnSync('docker', args, { encoding: 'utf8', windowsHide: true });
  if (result.status !== 0) {
    throw new Error(`Docker failed: ${args[0]}`);
  }
  return result.stdout.trim();
};
const pause = () => new Promise(resolve => setTimeout(resolve, 250));
async function waitUntil(check, remaining = 120) {
  if (await check()) {
    return;
  }
  if (!remaining) {
    throw new Error('Local service did not become ready');
  }
  await pause();
  return waitUntil(check, remaining - 1);
}
async function waitFor(url) {
  return waitUntil(async () => {
    try {
      return (await fetch(url)).ok;
    } catch {
      return false;
    }
  });
}
async function assertFree(port) {
  await new Promise((resolve, reject) => {
    const connection = createConnection({ host: '127.0.0.1', port });
    connection.once('connect', () => {
      connection.destroy();
      reject(new Error(`Port ${port} is already in use`));
    });
    connection.once('error', error => (error.code === 'ECONNREFUSED' ? resolve() : reject(error)));
  });
}
function launch(command, args, cwd, env) {
  const process = spawn(command, args, {
    cwd,
    env: { ...globalThis.process.env, ...env },
    windowsHide: true,
    stdio: 'ignore',
  });
  processes.push(process);
  return process;
}
const objects = new Set();
const pixel = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aZ1cAAAAASUVORK5CYII=',
  'base64',
);
const storage = createServer(async (request, response) => {
  for await (const chunk of request) {
    void chunk;
  }
  if (request.method === 'POST') {
    objects.add(request.url);
  }
  if (request.method === 'DELETE') {
    objects.delete(request.url);
  }
  response.writeHead(200, { 'Content-Type': 'image/png' });
  response.end(pixel);
});
let containerStarted = false;
try {
  await Promise.all([5050, 13000, 15440, 15441].map(assertFree));
  await new Promise(resolve => storage.listen(15441, '127.0.0.1', resolve));
  docker([
    'run',
    '--rm',
    '--detach',
    '--pull=never',
    '--name',
    container,
    '--env',
    'POSTGRES_PASSWORD=local-test-only',
    '--env',
    'POSTGRES_DB=yarok_test',
    '--publish',
    '127.0.0.1:15440:5432',
    'postgres:16',
  ]);
  containerStarted = true;
  await waitUntil(
    () =>
      spawnSync('docker', ['exec', container, 'pg_isready', '-h', '127.0.0.1', '-U', 'postgres', '-d', 'yarok_test'], {
        windowsHide: true,
        stdio: 'ignore',
      }).status === 0,
  );
  const sql =
    readFileSync(`${backend}/database/001_schema.sql`, 'utf8') +
    readFileSync(`${backend}/database/003_integrity.sql`, 'utf8') +
    readFileSync(`${frontend}/docs/seed.local.sql`, 'utf8');
  const setup = spawnSync(
    'docker',
    ['exec', '-i', container, 'psql', '-U', 'postgres', '-d', 'yarok_test', '-v', 'ON_ERROR_STOP=1'],
    { input: sql, encoding: 'utf8', windowsHide: true },
  );
  assert.equal(setup.status, 0, `Schema, integrity migration and seed applied: ${setup.stderr}`);
  const databaseChecks = spawnSync(
    'dotnet',
    [`${backend}/tests/Yarok.Checks/bin/Debug/net10.0/Yarok.Checks.dll`, '--database'],
    {
      cwd: backend,
      env: {
        ...process.env,
        DATABASE_URL: 'Host=127.0.0.1;Port=15440;Database=yarok_test;Username=postgres;Password=local-test-only',
      },
      encoding: 'utf8',
      windowsHide: true,
    },
  );
  assert.equal(databaseChecks.status, 0, `Isolated backend regressions: ${databaseChecks.stderr}`);
  console.log(databaseChecks.stdout.trim());
  launch('dotnet', [`${backend}/src/Yarok.Api/bin/Debug/net10.0/Yarok.Api.dll`], backend, {
    ASPNETCORE_ENVIRONMENT: 'Development',
    ASPNETCORE_URLS: 'http://localhost:5050',
    DATABASE_URL: 'Host=127.0.0.1;Port=15440;Database=yarok_test;Username=postgres;Password=local-test-only',
    ADMIN_LOGIN: 'integration-admin',
    ADMIN_PASSWORD: 'integration-test-password',
    ADMIN_SESSION_SECRET: 'integration-only-session-secret-32-chars',
    SUPABASE_URL: 'http://127.0.0.1:15441',
    SUPABASE_SERVICE_KEY: 'integration-only-key',
    SMTP_HOST: '127.0.0.1',
    SMTP_PORT: '1',
    SMTP_USER: 'test@example.invalid',
    SMTP_PASSWORD: 'test',
    CONTACT_TO_EMAIL: 'receiver@example.invalid',
    TRUSTED_PROXY_IPS: '127.0.0.1,::1',
  });
  await waitFor('http://localhost:5050/health');
  launch(process.execPath, ['.output/server/index.mjs'], frontend, {
    NITRO_HOST: '127.0.0.1',
    NITRO_PORT: '13000',
    PORT: '13000',
    NUXT_PUBLIC_SITE_URL: 'http://127.0.0.1:13000',
    NUXT_PUBLIC_YANDEX_MAPS_API_KEY: '',
  });
  await waitFor('http://127.0.0.1:13000/');
  const base = 'http://127.0.0.1:13000';
  const request = (path, options = {}) => fetch(`${base}${path}`, { redirect: 'manual', ...options });
  assert.equal((await request('/catalog')).status, 200);
  assert.equal((await request('/catalog/nonexistent-category')).status, 404);
  assert.equal((await request('/admin/products')).status, 302);
  assert.equal((await request('/api/admin/products')).status, 401);
  const login = await request('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Yarok-Admin': '1' },
    body: JSON.stringify({ login: 'integration-admin', password: 'integration-test-password' }),
  });
  assert.equal(login.status, 200);
  const cookie = login.headers.get('set-cookie').split(';')[0];
  const headers = { cookie, 'X-Yarok-Admin': '1' };
  assert.equal((await request('/admin/products', { headers })).status, 200, 'SSR forwards admin cookie');
  const initial = await (await request('/api/admin/products', { headers })).json();
  assert.equal(initial.length, 2);
  const form = new FormData();
  for (const [key, value] of Object.entries({
    name: 'Integration product',
    slug: 'integration-product',
    categoryId: '1',
    colorId: '1',
    price: '0',
    isActive: 'false',
  })) {
    form.set(key, value);
  }
  form.set('image', new Blob([pixel], { type: 'image/png' }), 'pixel.png');
  const created = await request('/api/products/create', { method: 'POST', headers, body: form });
  assert.equal(created.status, 200);
  const { id } = await created.json();
  assert.equal(objects.size, 1, 'Upload reached local fake Storage');
  assert.equal((await (await request('/api/products')).json()).length, 2, 'Hidden product is excluded publicly');
  assert.equal(
    (await (await request('/api/admin/products', { headers })).json()).length,
    3,
    'Hidden product remains editable',
  );
  form.delete('image');
  form.set('removeImage', 'true');
  form.set('isActive', 'true');
  assert.equal((await request(`/api/products/${id}`, { method: 'PUT', headers, body: form })).status, 200);
  const updated = (await (await request('/api/products')).json()).find(item => item.id === id);
  assert.equal(updated.previewImage, null);
  assert.equal(updated.variants[0].price, '0.00');
  assert.equal((await request(`/api/products/${id}`, { method: 'PUT', headers: { cookie }, body: form })).status, 403);
  assert.equal(
    (
      await request('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: '{"company":"bot"}',
      })
    ).status,
    200,
  );
  // Forged client headers must not split one socket peer into different rate-limit buckets.
  async function exhaustLogin(attempt = 0) {
    assert.equal(
      (
        await request('/api/admin/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Yarok-Admin': '1',
            'X-Forwarded-For': `198.51.100.${attempt}`,
          },
          body: '{"login":"bad","password":"bad"}',
        })
      ).status,
      401,
    );
    if (attempt < 3) {
      return exhaustLogin(attempt + 1);
    }
  }
  await exhaustLogin();
  assert.equal(
    (
      await request('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Yarok-Admin': '1', 'X-Forwarded-For': '198.51.100.250' },
        body: '{}',
      })
    ).status,
    429,
  );
  assert.equal((await request('/api/admin/logout', { method: 'POST', headers })).status, 200);
  console.log(
    'PASS: local Nuxt → .NET → disposable PostgreSQL; SSR, 404, cookie, private catalog, upload/removal, zero price, CSRF and spoof-resistant login limit.',
  );
} finally {
  await Promise.all(
    processes.reverse().map(async child => {
      if (child.exitCode === null) {
        const exited = new Promise(resolve => child.once('exit', resolve));
        child.kill();
        await exited;
      }
    }),
  );
  await new Promise(resolve => storage.close(resolve));
  if (containerStarted) {
    docker(['stop', container]);
  }
}
