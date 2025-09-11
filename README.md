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
- To wire real sources, replace logic in `lib/data.ts` with fetchers for Graylog, New Relic, etc.
- Add real quick-link destinations in `components/Sidebar.tsx`.

## Docker Development
```sh
docker run -it --rm \
   --name diro-troubleshoot \
   -p 3000:3000 \
   -v ./:/app \
   -w /app \
   node:18-alpine /bin/sh
```

