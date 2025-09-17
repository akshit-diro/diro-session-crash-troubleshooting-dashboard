# Diro Session Crash Troubleshooting

A lightweight Next.js + TypeScript app to analyze a single session across multiple components and log sources, producing a unified, filterable timeline.

## Features
- Input a Session ID and fetch unified timeline (mock data included)
- Collapsible sections: Session Overview, Alerts, Crash Hypothesis, Filters, Unified Timeline
- Component and log-source filters (pastel palette, compact timeline)
- Entire log entry is clickable to expand details
- Left collapsible Quick Links panel (placeholders for New Relic, OpenTelemetry, Graylog, etc.)
- Simple HTTP Basic Auth via Next middleware (credentials in env)

## Data Sources
- Mocked from `mockData.ts` to avoid live integrations.
- Graylog adapter included: enable by setting `GRAYLOG_*` env vars (see `.env.local.example`).
- To wire additional sources, extend `lib/fetchers.ts` and add adapters under `lib/adapters/`.
- Add real quick-link destinations in `components/Sidebar.tsx`.

## Graylog Integration
- Configure environment:
  - `GRAYLOG_BASE_URL` (e.g., `https://graylog.example.com:9000`)
  - Auth: either `GRAYLOG_TOKEN` (preferred) or `GRAYLOG_USERNAME`/`GRAYLOG_PASSWORD`.
  - Optional: `GRAYLOG_STREAMS` (comma-separated stream IDs), `GRAYLOG_RANGE_MINUTES`, `GRAYLOG_LIMIT`, `GRAYLOG_QUERY_PREFIX`.
- The API route `pages/api/logs/[type].ts` uses `lib/fetchers.ts`.
  - When `type=graylog` and Graylog is configured, it fetches live from Graylog using the universal relative search API and the provided session id as the query.
  - If Graylog is not configured, it falls back to mock filtering.
- For self-signed TLS in dev, you may need `NODE_TLS_REJECT_UNAUTHORIZED=0`.

## Docker Development
```sh
docker run -it --rm \
   --name diro-troubleshoot \
   -p 3000:3000 \
   -v ./:/app \
   -w /app \
   node:18-alpine /bin/sh
```
