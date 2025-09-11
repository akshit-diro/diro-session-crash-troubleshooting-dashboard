export type LogLevel = 'info' | 'warning' | 'error' | 'success';

export interface LogEntry {
  id: string;
  timestamp: string;
  component: string;
  logSource: string;
  level: LogLevel;
  message: string;
  details: string;
}

export interface ComponentData {
  id: string;
  name: string;
  displayName: string;
  color?: string;
  logSources: Array<{
    id: string;
    name: string;
    displayName: string;
  }>;
}

export interface SessionData {
  sessionId: string;
  status: string;
  startTime: string;
  endTime: string;
  duration?: string;
  userId?: string;
  tsInstance?: string;
  tsUsername?: string;
  tsIpAddress?: string;
  tsSessionId?: string;
}

export interface HypothesisItem {
  title: string; // e.g., "Primary Hypothesis"
  hypothesis: string; // e.g., "TS Session Timeout Exceeded"
  confidence: number; // 0-100
  points: string[]; // bullet points
  evidence?: string[]; // optional evidence list
}

export interface AlertItem {
  timestamp: string; // ISO string (UTC)
  platform: string; // e.g., Slack/Sentry/New Relic
  message: string;
}
