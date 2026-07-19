const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const workerUrl = pathToFileURL(path.resolve(__dirname, '../cloudflare/cta-events/worker.mjs'));

function mockDatabase() {
  const calls = [];
  return {
    calls,
    prepare(sql) {
      return {
        async first() {
          return { ok: 1 };
        },
        bind(...values) {
          return {
            async run() {
              calls.push({ sql, values });
            },
          };
        },
      };
    },
  };
}

async function loadWorker() {
  return (await import(workerUrl.href)).default;
}

test('health check proves the D1 binding is reachable', async () => {
  const worker = await loadWorker();
  const response = await worker.fetch(
    new Request('https://touseefshaik.com/api/events/health'),
    { DB: mockDatabase() },
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { ok: true, storage: 'd1' });
});

test('valid same-origin events increment one daily aggregate', async () => {
  const worker = await loadWorker();
  const DB = mockDatabase();
  const response = await worker.fetch(
    new Request('https://touseefshaik.com/api/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Origin: 'https://touseefshaik.com',
      },
      body: JSON.stringify({ name: 'ba_assistant_cta', path: '/' }),
    }),
    { DB },
  );

  assert.equal(response.status, 204);
  assert.equal(DB.calls.length, 1);
  assert.match(DB.calls[0].sql, /ON CONFLICT/);
  assert.match(DB.calls[0].values[0], /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(DB.calls[0].values[1], 'ba_assistant_cta');
  assert.equal(DB.calls[0].values[2], '/');
  assert.match(DB.calls[0].values[3], /^\d{4}-\d{2}-\d{2}T/);
});

test('cross-origin and unrecognized events are rejected without a write', async () => {
  const worker = await loadWorker();
  const DB = mockDatabase();

  const crossOrigin = await worker.fetch(
    new Request('https://touseefshaik.com/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'https://example.com' },
      body: JSON.stringify({ name: 'ba_assistant_cta', path: '/' }),
    }),
    { DB },
  );
  const unknownEvent = await worker.fetch(
    new Request('https://touseefshaik.com/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Origin: 'https://touseefshaik.com' },
      body: JSON.stringify({ name: 'email_address', path: '/' }),
    }),
    { DB },
  );

  assert.equal(crossOrigin.status, 403);
  assert.equal(unknownEvent.status, 400);
  assert.equal(DB.calls.length, 0);
});
