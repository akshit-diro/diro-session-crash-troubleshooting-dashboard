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

