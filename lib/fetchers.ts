import type { LogEntry, ComponentData } from './types';
import { classifyLogSourceType, type LogSourceType } from './logSources';
import { fetchGraylogLogs, configFromEnv as graylogConfigFromEnv } from './adapters/graylog';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const mock = require('../mockData');

// Unique source types present given the configured components
export function getAvailableLogSourceTypes(components: ComponentData[]): LogSourceType[] {
  const set = new Set<LogSourceType>();
  for (const c of components) {
    for (const s of c.logSources || []) {
      const t = classifyLogSourceType(s.id || s.name);
      if (t) set.add(t);
    }
  }
  return Array.from(set);
}

// Fetch logs for a specific "platform"/type in mock mode by filtering by logSource suffix
export async function fetchLogsForType(sessionId: string, type: LogSourceType): Promise<LogEntry[]> {
  if (type === 'graylog') {
    const cfg = graylogConfigFromEnv();
    if (cfg) {
      const results = await fetchGraylogLogs(sessionId, cfg);
      results.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      if (process.env.DEBUG_GRAYLOG === '1') {
        // eslint-disable-next-line no-console
        console.log('[graylog] fetched', results.length, 'entries for session', sessionId);
        if (results[0]) {
          // eslint-disable-next-line no-console
          console.log('[graylog] first entry', {
            id: results[0].id,
            timestamp: results[0].timestamp,
            component: results[0].component,
            level: results[0].level,
            message: results[0].message,
          });
        }
      }
      return results;
    }
  }

  // Default: mock mode, filter by source type
  const all: LogEntry[] = (mock.mockLogEntries || []) as LogEntry[];
  const filtered = all.filter((e) => {
    const s = JSON.stringify(e);
    if (!s.includes(sessionId)) return false;
    const t = classifyLogSourceType(e.logSource || '');
    return t === type;
  });
  filtered.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  // Simulate per-source latency slightly for better UX (noop if not desired)
  await new Promise((r) => setTimeout(r, 150));
  return filtered;
}

// Convenience to fetch all present types and merge
export async function fetchAllByTypes(sessionId: string, types: LogSourceType[]): Promise<LogEntry[]> {
  const parts = await Promise.all(types.map((t) => fetchLogsForType(sessionId, t)));
  const merged = ([] as LogEntry[]).concat(...parts);
  merged.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  return merged;
}
