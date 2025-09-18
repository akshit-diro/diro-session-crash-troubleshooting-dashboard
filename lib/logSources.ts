export type LogSourceType = 'new_relic' | 'graylog';

export interface LogSourceKind {
  key: LogSourceType;
  label: string;
}

// Determine platform/type from a log source id/name like "011-bookingengine-docker_logs"
export function classifyLogSourceType(idOrName: string): LogSourceType | null {
  const s = idOrName.toLowerCase();
  // docker_logs originate from New Relic sources in our setup
  if (s.includes('docker_logs')) return 'new_relic';
  if (s.includes('graylogs') || s.includes('graylog')) return 'graylog';
  // TS logs are now fetched via Graylog
  if (s.includes('powershell') || s.includes('eventlogs') || s.includes('eventlog')) return 'graylog';
  return null;
}

export const LOG_SOURCE_KINDS: LogSourceKind[] = [
  { key: 'new_relic', label: 'New Relic' },
  { key: 'graylog', label: 'Graylog' },
];
