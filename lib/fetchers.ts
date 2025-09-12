import type { LogEntry, ComponentData } from './types';
import { classifyLogSourceType, type LogSourceType } from './logSources';

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

