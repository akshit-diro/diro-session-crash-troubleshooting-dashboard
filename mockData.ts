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

// Separated component details and log sources
export interface ComponentDetails {
  id: string;
  name: string;
  displayName: string;
  color: string;
}

export interface LogSourceDetails {
  id: string;
  name: string;
  displayName: string;
}

export type LogSourcesByComponent = Record<string, LogSourceDetails[]>;

// Backward-compatible union that preserves the original shape when needed
export interface ComponentData extends ComponentDetails {
  logSources: LogSourceDetails[];
}

// 1) Component details (no logSources)
export const componentDetails: ComponentDetails[] = [
  { id: "loadbalancer", name: "infra_loadbalancer", displayName: "Load Balancer", color: "bg-pink-200 text-pink-800 border-pink-300" },
  { id: "gateway", name: "infra_gateway", displayName: "API Gateway", color: "bg-purple-200 text-purple-800 border-purple-300" },
  { id: "booking_engine", name: "booking_engine", displayName: "Booking Engine", color: "bg-cyan-200 text-cyan-800 border-cyan-300" },
  { id: "tomcat", name: "diro_guac_tomcat", displayName: "Web Server", color: "bg-blue-200 text-blue-800 border-blue-300" },
  { id: "guacd", name: "diro_guacd", displayName: "Remote Desktop Gateway", color: "bg-green-200 text-green-800 border-green-300" },
  { id: "guacamole", name: "diro_guac", displayName: "Guacamole Client", color: "bg-emerald-200 text-emerald-800 border-emerald-300" },
  { id: "terminal_server", name: "TS", displayName: "Terminal Server", color: "bg-indigo-200 text-indigo-800 border-indigo-300" },
  { id: "browser", name: "chrome", displayName: "Web Browser", color: "bg-teal-200 text-teal-800 border-teal-300" },
  { id: "extension", name: "an_extension", displayName: "Browser Extension", color: "bg-orange-200 text-orange-800 border-orange-300" },
  { id: "automation", name: "an_python", displayName: "Automation Engine", color: "bg-rose-200 text-rose-800 border-rose-300" },
  { id: "keepalive", name: "keepalive_python", displayName: "Keep-Alive Service", color: "bg-yellow-200 text-yellow-800 border-yellow-300" },
];

// 2) Log sources per component
export const logSourcesByComponent: LogSourcesByComponent = {
  loadbalancer: [
    { id: "001-infra_loadbalancer", name: "001-infra_loadbalancer", displayName: "Docker Logs" },
  ],
  gateway: [
    { id: "002-infra_gateway", name: "002-infra_gateway", displayName: "Docker Logs" },
  ],
  booking_engine: [
    { id: "011-bookingengine-docker_logs", name: "011-bookingengine-docker_logs", displayName: "Docker Logs" },
  ],
  tomcat: [
    { id: "031-diro_guac_tomcat-docker_logs", name: "031-diro_guac_tomcat-docker_logs", displayName: "Docker Logs" },
  ],
  guacd: [
    { id: "032-diro_guacd-docker_logs", name: "032-diro_guacd-docker_logs", displayName: "Docker Logs" },
  ],
  guacamole: [
    { id: "033-diro_guac-graylogs", name: "033-diro_guac-graylogs", displayName: "Gray Logs" },
  ],
  terminal_server: [
    { id: "061-TS_eventlogs-powershell", name: "061-TS_eventlogs-powershell", displayName: "Event Logs" },
    { id: "062-TS_sessionlogs-powershell", name: "062-TS_sessionlogs-powershell", displayName: "Session Logs" },
    { id: "063-TS_disconnectlogs-powershell", name: "063-TS_disconnectlogs-powershell", displayName: "Disconnect Logs" },
  ],
  browser: [
    { id: "071-chrome-powershell", name: "071-chrome-powershell", displayName: "Browser Logs" },
  ],
  extension: [
    { id: "041-an_extenstion-graylogs", name: "041-an_extenstion-graylogs", displayName: "Extension Logs" },
  ],
  automation: [
    { id: "042-an_python-graylogs", name: "042-an_python-graylogs", displayName: "Gray Logs" },
    { id: "043-an_python-docker_logs", name: "043-an_python-docker_logs", displayName: "Docker Logs" },
  ],
  keepalive: [
    { id: "051-keepalive_python-graylogs", name: "051-keepalive_python-graylogs", displayName: "Gray Logs" },
    { id: "052-keepalive_python-docker_logs", name: "052-keepalive_python-docker_logs", displayName: "Docker Logs" },
  ],
};

// 3) Backward-compatible combined structure for existing consumers
export const components: ComponentData[] = componentDetails.map((d) => ({
  ...d,
  logSources: logSourcesByComponent[d.id] || [],
}));

export const mockLogEntries: LogEntry[] = [];

export const mockSessionData = {};

// Hypotheses for the crash scenario analysis (mock)
export const mockHypotheses = [];

// Alerts across platforms
export const mockAlerts = [];
