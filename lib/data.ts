import type { LogEntry, SessionData, ComponentData } from './types';

// Import from existing root mockData.ts to avoid duplication
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mock = require('../mockData');

export const components: ComponentData[] = mock.components || [];
export const allEntries: LogEntry[] = mock.mockLogEntries || [];
export const mockSessionData: SessionData | undefined = mock.mockSessionData;

export function getUnifiedLogsBySession(sessionId: string): LogEntry[] {
  const entries: LogEntry[] = (allEntries || []).filter((e: LogEntry) => {
    const s = JSON.stringify(e);
    return s.includes(sessionId);
  });
  entries.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  return entries;
}

export function getSession(sessionId: string): SessionData {
  if (mockSessionData && mockSessionData.sessionId === sessionId) return mockSessionData;
  return { sessionId, status: 'Unknown', startTime: '', endTime: '' };
}

export function getLastTimestamps(entries: LogEntry[]): Record<string, string> {
  const last: Record<string, string> = {};
  for (const e of entries) last[e.component] = e.timestamp;
  return last;
}

