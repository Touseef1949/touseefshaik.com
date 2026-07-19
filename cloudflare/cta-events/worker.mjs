const ALLOWED_ORIGIN = 'https://touseefshaik.com';
const ALLOWED_EVENTS = new Set([
    'ba_assistant_cta',
    'path_requirements_to_specs',
    'path_agent_patterns',
    'path_enterprise_evals',
    'path_interview_prep',
]);

const NO_STORE_HEADERS = {
    'Cache-Control': 'no-store',
    'Content-Type': 'application/json; charset=utf-8',
};

function jsonResponse(body, status) {
    return new Response(JSON.stringify(body), {
        status,
        headers: NO_STORE_HEADERS,
    });
}

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        if (request.method === 'GET' && url.pathname === '/api/events/health') {
            const result = await env.DB.prepare('SELECT 1 AS ok').first();
            return jsonResponse({ ok: result?.ok === 1, storage: 'd1' }, 200);
        }

        if (request.method !== 'POST' || url.pathname !== '/api/events') {
            return jsonResponse({ error: 'not_found' }, 404);
        }

        if (request.headers.get('Origin') !== ALLOWED_ORIGIN) {
            return jsonResponse({ error: 'origin_not_allowed' }, 403);
        }

        const contentType = request.headers.get('Content-Type') || '';
        const contentLength = Number(request.headers.get('Content-Length') || 0);
        if (!contentType.startsWith('application/json') || contentLength > 512) {
            return jsonResponse({ error: 'invalid_request' }, 400);
        }

        let body;
        try {
            const rawBody = await request.text();
            if (rawBody.length > 512) {
                return jsonResponse({ error: 'invalid_request' }, 400);
            }
            body = JSON.parse(rawBody);
        } catch (_) {
            return jsonResponse({ error: 'invalid_json' }, 400);
        }

        const eventName = body?.name;
        const pagePath = body?.path;
        const validPath = typeof pagePath === 'string'
            && pagePath.startsWith('/')
            && !pagePath.includes('?')
            && !pagePath.includes('#')
            && pagePath.length <= 160;

        if (!ALLOWED_EVENTS.has(eventName) || !validPath) {
            return jsonResponse({ error: 'invalid_event' }, 400);
        }

        const now = new Date().toISOString();
        const eventDate = now.slice(0, 10);
        await env.DB.prepare(`
            INSERT INTO daily_event_counts (
                event_date,
                event_name,
                page_path,
                count,
                updated_at
            ) VALUES (?, ?, ?, 1, ?)
            ON CONFLICT (event_date, event_name, page_path)
            DO UPDATE SET
                count = count + 1,
                updated_at = excluded.updated_at
        `).bind(eventDate, eventName, pagePath, now).run();

        return new Response(null, {
            status: 204,
            headers: { 'Cache-Control': 'no-store' },
        });
    },
};
