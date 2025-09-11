export function formatDateTimeUTC(ts?: string | null): string {
  if (!ts) return '—';
  try {
    return new Date(ts).toISOString().replace('T', ' ').replace('Z', ' UTC');
  } catch {
    return String(ts);
  }
}

export function formatTimeUTC(ts?: string | null): string {
  if (!ts) return '—';
  try {
    return new Date(ts).toISOString().substring(11, 19); // HH:MM:SS (UTC)
  } catch {
    return String(ts);
  }
}

