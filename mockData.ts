// Mock data for the application - Generated from US-ZqLRz0 session logs

export interface LogEntry {
  id: string;
  timestamp: string;
  component: string;
  logSource: string;
  level: "info" | "warning" | "error" | "success";
  message: string;
  details: string;
}

export interface ComponentData {
  id: string;
  name: string;
  displayName: string;
  color: string;
  logSources: Array<{
    id: string;
    name: string;
    displayName: string;
  }>;
}

export const components: ComponentData[] = [];

export const mockLogEntries: LogEntry[] = [];

export const mockSessionData = {};