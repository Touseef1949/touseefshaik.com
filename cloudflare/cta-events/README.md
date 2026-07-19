# CTA event collection

This Worker records privacy-safe daily aggregates for the site's five CTA event
names. It stores only the UTC date, event name, page path, count, and last update
time. It does not store cookies, user identifiers, IP addresses, user agents, or
referrers in D1.

Apply the schema and deploy from the repository root:

```bash
wrangler d1 execute touseefshaik-site-events \
  --remote --file=cloudflare/cta-events/schema.sql
wrangler deploy --config cloudflare/cta-events/wrangler.jsonc
```

Review monthly conversion counts:

```bash
wrangler d1 execute touseefshaik-site-events --remote --command="
  SELECT event_date, event_name, page_path, count
  FROM daily_event_counts
  ORDER BY event_date DESC, event_name, page_path;
"
```
