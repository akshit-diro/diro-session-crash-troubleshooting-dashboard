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
  { id: "infra_loadbalancer", name: "infra_loadbalancer", displayName: "Load Balancer", color: "bg-pink-200 text-pink-800 border-pink-300" },
  { id: "infra_gateway", name: "infra_gateway", displayName: "Express Gateway", color: "bg-purple-200 text-purple-800 border-purple-300" },
  { id: "booking_engine", name: "booking_engine", displayName: "Booking Engine", color: "bg-cyan-200 text-cyan-800 border-cyan-300" },
  { id: "diro_guac_tomcat", name: "diro_guac_tomcat", displayName: "Diro Guacamole Tomcat", color: "bg-blue-200 text-blue-800 border-blue-300" },
  { id: "diro_guacd", name: "diro_guacd", displayName: "Diro Guacamole guacd", color: "bg-green-200 text-green-800 border-green-300" },
  { id: "diro_guac", name: "diro_guac", displayName: "Diro Guacamole", color: "bg-emerald-200 text-emerald-800 border-emerald-300" },
  { id: "terminal_server", name: "terminal_server", displayName: "Terminal Server", color: "bg-indigo-200 text-indigo-800 border-indigo-300" },
  { id: "chrome", name: "chrome", displayName: "Chrome", color: "bg-teal-200 text-teal-800 border-teal-300" },
  { id: "an_extension", name: "an_extension", displayName: "AutoNav Extension", color: "bg-orange-200 text-orange-800 border-orange-300" },
  { id: "an_python", name: "an_python", displayName: "AutoNav Server", color: "bg-rose-200 text-rose-800 border-rose-300" },
  { id: "keepalive", name: "keepalive", displayName: "Keep Alive", color: "bg-yellow-200 text-yellow-800 border-yellow-300" },
];

// 2) Log sources per component
export const logSourcesByComponent: LogSourcesByComponent = {
  // infra_loadbalancer: [
  //   { id: "001-infra_loadbalancer", name: "001-infra_loadbalancer", displayName: "Docker Logs" },
  // ],
  // infra_gateway: [
  //   { id: "002-infra_gateway", name: "002-infra_gateway", displayName: "Docker Logs" },
  // ],
  booking_engine: [
    { id: "011-bookingengine-docker_logs", name: "011-bookingengine-docker_logs", displayName: "Docker Logs" },
  ],
  diro_guac_tomcat: [
    { id: "031-diro_guac_tomcat-docker_logs", name: "031-diro_guac_tomcat-docker_logs", displayName: "Docker Logs" },
  ],
  diro_guacd: [
    { id: "032-diro_guacd-docker_logs", name: "032-diro_guacd-docker_logs", displayName: "Docker Logs" },
  ],
  diro_guac: [
    { id: "033-diro_guac-graylogs", name: "033-diro_guac-graylogs", displayName: "Gray Logs" },
  ],
  terminal_server: [
    { id: "061-TS_eventlogs-powershell", name: "061-TS_eventlogs-powershell", displayName: "Event Logs" },
    { id: "062-TS_sessionlogs-powershell", name: "062-TS_sessionlogs-powershell", displayName: "Session Logs" },
    { id: "063-TS_disconnectlogs-powershell", name: "063-TS_disconnectlogs-powershell", displayName: "Disconnect Logs" },
  ],
  chrome: [
    { id: "071-chrome-powershell", name: "071-chrome-powershell", displayName: "Browser Logs" },
  ],
  an_extension: [
    { id: "041-an_extenstion-graylogs", name: "041-an_extenstion-graylogs", displayName: "Extension Logs" },
  ],
  an_python: [
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

export const mockLogEntries: LogEntry[] = [
  // Booking Engine Logs
  {
    id: "1",
    timestamp: "2025-09-06T02:57:20.000Z",
    component: "booking_engine",
    logSource: "011-bookingengine-docker_logs",
    level: "info",
    message: "User session initiated for trustengine1064",
    details: "User ID: 1064\nUser Type: Mobile\nStatus: busy\nWindow Status: busy\nSession ID: US-ZqLRz0\nServer: C\nAutonav Active: 0\nFree Time: 2025-09-06T03:27:20.000Z"
  },
  {
    id: "2",
    timestamp: "2025-09-06T02:59:36.000Z",
    component: "booking_engine",
    logSource: "011-bookingengine-docker_logs",
    level: "info",
    message: "User session updated for trustengine1082",
    details: "User ID: 1082\nUser Type: Mobile\nStatus: busy\nWindow Status: busy\nSession ID: US-ZqLRz0\nServer: C\nAutonav Active: 0\nLast Used: 2025-09-06T00:48:38.000Z"
  },
  {
    id: "3",
    timestamp: "2025-09-06T03:00:49.000Z",
    component: "booking_engine",
    logSource: "011-bookingengine-docker_logs",
    level: "success",
    message: "Autonav status updated to true for session US-ZqLRz0",
    details: "User: trustengine1075\nSession ID: US-ZqLRz0\nApp: user booking engine\nEnvironment: prod\nTS Status: autonav enabled\nTimestamp: 1757127765.631"
  },
  {
    id: "4",
    timestamp: "2025-09-06T03:00:49.000Z",
    component: "booking_engine",
    logSource: "011-bookingengine-docker_logs",
    level: "success",
    message: "Server connection successful",
    details: "User: trustengine1075\nSession ID: US-ZqLRz0\nApp: user management\nEnvironment: prod\nTimestamp: 1757127767.918"
  },
  {
    id: "5",
    timestamp: "2025-09-06T03:00:49.000Z",
    component: "booking_engine",
    logSource: "011-bookingengine-docker_logs",
    level: "info",
    message: "User session status changed to free",
    details: "User: trustengine1075\nStatus: free\nWindow Status: free\nGuac Status: cleanup expired\nAutonav Active: 1\nLast Used: 2025-09-06T03:53:08.000Z"
  },

  // Session Document API Logs
  {
    id: "6",
    timestamp: "2025-09-06T02:57:21.000Z",
    component: "booking_engine",
    logSource: "021-diro-session_doc-api_getLastClickedLink",
    level: "info",
    message: "Auto download initiated for session US-ZqLRz0",
    details: "Progress: 6a\nDetection: Auto-Nav Chrome extension\nTime: 1757127768018\nSession ID: US-ZqLRz0\nDevice Type: iPhone\nBrowser: latestBrowser"
  },
  {
    id: "7",
    timestamp: "2025-09-06T02:57:21.000Z",
    component: "booking_engine",
    logSource: "021-diro-session_doc-api_getLastClickedLink",
    level: "info",
    message: "Session data retrieved successfully",
    details: "Session ID: US-ZqLRz0\nUser IP: 137.118.191.226\nLocation: Traphill, NC, US\nOrganization: K12\nUse Case: Address verification\nMax Files: 6\nValid Date Range: 30 days"
  },

  // Guacamole Connection Logs
  {
    id: "8",
    timestamp: "2025-09-06T02:57:21.347Z",
    component: "diro_guac",
    logSource: "033-diro_guac-graylogs",
    level: "info",
    message: "IFRAME URL for verification link",
    details: "URL: https://verificationlinks.diro.io/#/docLinks/address/US-ZqLRz0/US-ZqLRz0/US\nSession: US-ZqLRz0\nStage: DEBUG"
  },
  {
    id: "9",
    timestamp: "2025-09-06T02:57:21.348Z",
    component: "diro_guac",
    logSource: "033-diro_guac-graylogs",
    level: "info",
    message: "Connection connecting",
    details: "Connection State: CONNECTING\nTunnel Unstable: false\nStatus Code: 0\nSession: US-ZqLRz0"
  },
  {
    id: "10",
    timestamp: "2025-09-06T02:57:21.351Z",
    component: "diro_guac",
    logSource: "033-diro_guac-graylogs",
    level: "info",
    message: "Connection connected but waiting",
    details: "Connection State: WAITING\nTunnel Unstable: false\nStatus Code: 0\nSession: US-ZqLRz0"
  },
  {
    id: "11",
    timestamp: "2025-09-06T02:57:21.353Z",
    component: "diro_guac",
    logSource: "033-diro_guac-graylogs",
    level: "info",
    message: "GeoIP found for current session",
    details: "Stage: 8\nSession: US-ZqLRz0\nLocation: Traphill, NC, US\nIP: 137.118.191.226"
  },
  {
    id: "12",
    timestamp: "2025-09-06T02:57:21.377Z",
    component: "diro_guac",
    logSource: "033-diro_guac-graylogs",
    level: "success",
    message: "Guacamole tunnel state opened",
    details: "Connection State: WAITING\nTunnel Unstable: false\nStatus Code: 0\nSession: US-ZqLRz0"
  },
  {
    id: "13",
    timestamp: "2025-09-06T02:57:21.405Z",
    component: "diro_guac",
    logSource: "033-diro_guac-graylogs",
    level: "info",
    message: "Socket connection established",
    details: "Stage: 4\nSession: US-ZqLRz0\nProtocol: RDP\nHost: prod-ts3-gcp.diro.live:3546"
  },
  {
    id: "14",
    timestamp: "2025-09-06T02:57:25.394Z",
    component: "diro_guac",
    logSource: "033-diro_guac-graylogs",
    level: "success",
    message: "Connection established successfully",
    details: "Connection State: CONNECTED\nTunnel Unstable: false\nStatus Code: 0\nSession: US-ZqLRz0\nActions: Sync clipboard, Begin audio streaming, Update thumbnail"
  },
  {
    id: "15",
    timestamp: "2025-09-06T02:57:30.619Z",
    component: "diro_guac",
    logSource: "033-diro_guac-graylogs",
    level: "error",
    message: "Guacamole connection error",
    details: "Error: CLIENT.ERROR_CLIENT_ 203\nSession: US-ZqLRz0\nConnection ID: MABjAHF1aWNrY29ubmVjdA\nTunnel UUID: ed28eccc-f037-454c-be75-a4bcf5246b14"
  },
  {
    id: "16",
    timestamp: "2025-09-06T02:57:30.620Z",
    component: "diro_guac",
    logSource: "033-diro_guac-graylogs",
    level: "warning",
    message: "Disconnected or disconnecting",
    details: "Session: US-ZqLRz0\nConnection ID: MABjAHF1aWNrY29ubmVjdA\nDisplay Size: 372x627\nProtocol: RDP\nStatus: CLIENT_ERROR"
  },

  // Extension Logs
  {
    id: "17",
    timestamp: "2025-09-06T02:59:45.889Z",
    component: "an_extension",
    logSource: "041-an_extenstion-graylogs",
    level: "info",
    message: "Making API Request to update autonav session",
    details: "URL: https://api.diro.io/autonav_temp/update_autoNav_session\nSession: US-ZqLRz0\nMethod: POST"
  },
  {
    id: "18",
    timestamp: "2025-09-06T02:59:46.174Z",
    component: "an_extension",
    logSource: "041-an_extenstion-graylogs",
    level: "info",
    message: "Get Last Clicked Link called",
    details: "Session: US-ZqLRz0\nAction: Last clicked link called\nTimestamp: 1757127586087"
  },
  {
    id: "19",
    timestamp: "2025-09-06T02:59:46.174Z",
    component: "an_extension",
    logSource: "041-an_extenstion-graylogs",
    level: "info",
    message: "AutoNav Phase Update",
    details: "Session ID: US-ZqLRz0\nPhase: PhaseSessionInitiation\nStatus: inProgress\nInit Time: 1757127586087"
  },
  {
    id: "20",
    timestamp: "2025-09-06T02:59:46.793Z",
    component: "an_extension",
    logSource: "041-an_extenstion-graylogs",
    level: "info",
    message: "Update Auto Nav session Data called",
    details: "Session: US-ZqLRz0\nDevice Details: iPhone, TS-Session3, Guac 1.5.5\nBrowser: latestBrowser\nLocation: Traphill"
  },
  {
    id: "21",
    timestamp: "2025-09-06T02:59:50.197Z",
    component: "an_extension",
    logSource: "041-an_extenstion-graylogs",
    level: "info",
    message: "Socket Message Received: link_selected_iframe",
    details: "Session: US-ZqLRz0\nMessage: link_selected_iframe\nLink: https://www.syemc.com/\nAlpha2 Code: US"
  },
  {
    id: "22",
    timestamp: "2025-09-06T02:59:50.208Z",
    component: "an_extension",
    logSource: "041-an_extenstion-graylogs",
    level: "info",
    message: "Socket Message Received: fingerPrint-2.0",
    details: "Session: US-ZqLRz0\nDevice Type: Mobile/Tablet\nBrowser: Safari 18.6\nScreen: 375x812\nOS: iOS\nUser Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X)"
  },

  // Python Automation Logs
  {
    id: "23",
    timestamp: "2025-09-06T03:00:14.153Z",
    component: "an_python",
    logSource: "042-an_python-graylogs",
    level: "info",
    message: "URL Consistency Checked",
    details: "Base URL: https://www.syemc.com/\nCurrent URL: https://syemc.smarthub.coop/Login.html\nConsistency: True\nReasoning: Visual brand analysis shows consistent SYEMC branding and SmartHub integration"
  },
  {
    id: "24",
    timestamp: "2025-09-06T03:00:15.505Z",
    component: "an_python",
    logSource: "042-an_python-graylogs",
    level: "info",
    message: "URL Consistency Checked",
    details: "Base URL: https://www.syemc.com/\nCurrent URL: https://syemc.smarthub.coop/ui\nConsistency: True\nReasoning: Blank screenshot defaults to TRUE, syemc subdomain indicates official integration"
  },
  {
    id: "25",
    timestamp: "2025-09-06T03:00:59.065Z",
    component: "an_python",
    logSource: "042-an_python-graylogs",
    level: "info",
    message: "Cleaning up Session for US-ZqLRz0",
    details: "Session: US-ZqLRz0\nAction: Cleanup initiated\nTime: 06-09-2025 03:00:59\nStatus: In progress"
  },
  {
    id: "26",
    timestamp: "2025-09-06T03:00:59.323Z",
    component: "an_python",
    logSource: "042-an_python-graylogs",
    level: "success",
    message: "Session Cleaned up for US-ZqLRz0",
    details: "Session: US-ZqLRz0\nAction: Cleanup completed\nTime: 06-09-2025 03:00:59\nStatus: Success"
  },

  // Keep-Alive Service Logs
  {
    id: "27",
    timestamp: "2025-09-06T03:02:48.064Z",
    component: "keepalive",
    logSource: "051-keepalive_python-graylogs",
    level: "info",
    message: "Attempting to establish websocket tunnel",
    details: "Session: US-ZqLRz0-3d4d22b79e78\nAction: WebSocket tunnel establishment\nStatus: Attempting"
  },
  {
    id: "28",
    timestamp: "2025-09-06T03:02:48.090Z",
    component: "keepalive",
    logSource: "051-keepalive_python-graylogs",
    level: "success",
    message: "Websocket tunnel connected",
    details: "Session: US-ZqLRz0-3d4d22b79e78\nStatus: Connected\nAction: Tunnel established successfully"
  },
  {
    id: "29",
    timestamp: "2025-09-06T03:02:48.123Z",
    component: "keepalive",
    logSource: "051-keepalive_python-graylogs",
    level: "info",
    message: "Sending nop to Guacamole",
    details: "Session: US-ZqLRz0-3d4d22b79e78\nAction: Keep-alive ping\nTarget: Guacamole\nStatus: Sent"
  },
  {
    id: "30",
    timestamp: "2025-09-06T03:03:28.154Z",
    component: "keepalive",
    logSource: "051-keepalive_python-graylogs",
    level: "error",
    message: "Websocket tunnel connection failed",
    details: "Session: US-ZqLRz0-3d4d22b79e78\nError: received 1000 (OK) 0; then sent 1000 (OK) 0\nStatus: Connection failed"
  },
  {
    id: "31",
    timestamp: "2025-09-06T03:03:28.168Z",
    component: "keepalive",
    logSource: "051-keepalive_python-graylogs",
    level: "warning",
    message: "Handling unexpected disconnect",
    details: "Session: US-ZqLRz0-3d4d22b79e78\nCause: connection_failure\nAction: Handling disconnect"
  },
  {
    id: "32",
    timestamp: "2025-09-06T03:03:28.474Z",
    component: "keepalive",
    logSource: "051-keepalive_python-graylogs",
    level: "info",
    message: "Keepalive status notify -> disconnected",
    details: "URL: https://api.diro.io/bookeng/change-kepalive-status\nPayload: {'sessionid': 'US-ZqLRz0', 'status': 'disconnected'}\nAction: Status notification sent"
  },
  {
    id: "33",
    timestamp: "2025-09-06T03:03:28.830Z",
    component: "keepalive",
    logSource: "051-keepalive_python-graylogs",
    level: "info",
    message: "Attempting reconnect (1/3)",
    details: "Session: US-ZqLRz0-3d4d22b79e78\nAttempt: 1 of 3\nAction: Reconnection initiated"
  },
  {
    id: "34",
    timestamp: "2025-09-06T03:03:28.988Z",
    component: "keepalive",
    logSource: "051-keepalive_python-graylogs",
    level: "success",
    message: "Websocket tunnel connected",
    details: "Session: US-ZqLRz0-3d4d22b79e78\nStatus: Reconnected\nAction: Tunnel re-established successfully"
  },

  // Terminal Server Event Logs
  {
    id: "35",
    timestamp: "2025-09-06T03:00:54.000Z",
    component: "terminal_server",
    logSource: "062-TS_sessionlogs-powershell",
    level: "info",
    message: "Begin session arbitration",
    details: "User: DIROTS\\trustengine1075\nSession ID: 600\nEvent ID: 41\nLog: Microsoft-Windows-TerminalServices-LocalSessionManager/Operational"
  },
  {
    id: "36",
    timestamp: "2025-09-06T03:00:54.000Z",
    component: "terminal_server",
    logSource: "062-TS_sessionlogs-powershell",
    level: "info",
    message: "End session arbitration",
    details: "User: DIROTS\\trustengine1075\nSession ID: 600\nEvent ID: 42\nLog: Microsoft-Windows-TerminalServices-LocalSessionManager/Operational"
  },
  {
    id: "37",
    timestamp: "2025-09-06T03:00:55.000Z",
    component: "terminal_server",
    logSource: "062-TS_sessionlogs-powershell",
    level: "success",
    message: "Remote Desktop Services: Session logon succeeded",
    details: "User: DIROTS\\trustengine1075\nSession ID: 600\nSource Network Address: 172.20.2.81\nEvent ID: 21"
  },
  {
    id: "38",
    timestamp: "2025-09-06T03:00:55.000Z",
    component: "terminal_server",
    logSource: "062-TS_sessionlogs-powershell",
    level: "info",
    message: "Remote Desktop Services: Shell start notification received",
    details: "User: DIROTS\\trustengine1075\nSession ID: 600\nSource Network Address: 172.20.2.81\nEvent ID: 22"
  },
  {
    id: "39",
    timestamp: "2025-09-06T03:03:11.000Z",
    component: "terminal_server",
    logSource: "062-TS_sessionlogs-powershell",
    level: "warning",
    message: "Session 600 has been disconnected",
    details: "Session ID: 600\nEvent ID: 40\nLog: Microsoft-Windows-TerminalServices-LocalSessionManager/Operational"
  },
  {
    id: "40",
    timestamp: "2025-09-06T03:03:11.000Z",
    component: "terminal_server",
    logSource: "062-TS_sessionlogs-powershell",
    level: "info",
    message: "Remote Desktop Services: Session has been disconnected",
    details: "User: DIROTS\\trustengine1075\nSession ID: 600\nSource Network Address: 172.20.2.81\nEvent ID: 24"
  },
  {
    id: "41",
    timestamp: "2025-09-06T03:04:13.000Z",
    component: "terminal_server",
    logSource: "062-TS_sessionlogs-powershell",
    level: "info",
    message: "Remote Desktop Services: Session logoff succeeded",
    details: "User: DIROTS\\trustengine1075\nSession ID: 600\nEvent ID: 23\nLog: Microsoft-Windows-TerminalServices-LocalSessionManager/Operational"
  },

  // Terminal Server Disconnect Logs
  {
    id: "42",
    timestamp: "2025-09-06T03:00:47.000Z",
    component: "terminal_server",
    logSource: "063-TS_disconnectlogs-powershell",
    level: "info",
    message: "PowerShell transcript started",
    details: "Start Time: 20250906030047\nUsername: DIROTS\\parul.power\nMachine: WINTS-2019-STAG\nProcess ID: 66568\nScript: all_disconnected_session.ps1"
  },
  {
    id: "43",
    timestamp: "2025-09-06T03:00:47.000Z",
    component: "terminal_server",
    logSource: "063-TS_disconnectlogs-powershell",
    level: "info",
    message: "Disconnected user: trustengine1082",
    details: "User: trustengine1082\nSession ID: 599\nAction: Disconnected user detected\nWait Time: 90 seconds before logoff"
  },
  {
    id: "44",
    timestamp: "2025-09-06T03:02:19.000Z",
    component: "terminal_server",
    logSource: "063-TS_disconnectlogs-powershell",
    level: "info",
    message: "Logging off session ID: 599",
    details: "Session ID: 599\nUser: trustengine1082\nAction: Session logoff\nStatus: Completed"
  },
  {
    id: "45",
    timestamp: "2025-09-06T03:03:12.000Z",
    component: "terminal_server",
    logSource: "063-TS_disconnectlogs-powershell",
    level: "info",
    message: "Disconnected user: trustengine1075",
    details: "User: trustengine1075\nSession ID: 600\nAutonav Active: true\nSession: US-ZqLRz0\nAction: Logoff not required"
  },
  {
    id: "46",
    timestamp: "2025-09-06T03:03:12.000Z",
    component: "terminal_server",
    logSource: "063-TS_disconnectlogs-powershell",
    level: "info",
    message: "Waiting 60 seconds before logging off user trustengine1075",
    details: "User: trustengine1075\nSession: US-ZqLRz0\nWait Time: 60 seconds\nReason: Autonav active session"
  },

  // Docker Logs
  {
    id: "47",
    timestamp: "2025-09-06T03:02:47.712Z",
    component: "keepalive",
    logSource: "052-keepalive_python-docker_logs",
    level: "warning",
    message: "InsecureRequestWarning: Unverified HTTPS request",
    details: "Host: nginx\nWarning: Unverified HTTPS request being made\nRecommendation: Add certificate verification\nLibrary: urllib3.connectionpool"
  },
  {
    id: "48",
    timestamp: "2025-09-06T03:02:47.901Z",
    component: "keepalive",
    logSource: "052-keepalive_python-docker_logs",
    level: "info",
    message: "HTTP POST request processed",
    details: "IP: 10.5.43.174:17504\nMethod: POST\nPath: /keepalive/server-connect\nStatus: 200\nTime: 2025-09-06T03:02:47.901Z"
  },
  {
    id: "49",
    timestamp: "2025-09-06T03:03:28.073Z",
    component: "keepalive",
    logSource: "052-keepalive_python-docker_logs",
    level: "error",
    message: "Websocket tunnel connection failed",
    details: "Session: US-ZqLRz0-3d4d22b79e78\nError: received 1000 (OK) 0; then sent 1000 (OK) 0\nTime: 2025-09-06T03:03:28.073Z"
  },
  {
    id: "50",
    timestamp: "2025-09-06T03:03:28.736Z",
    component: "keepalive",
    logSource: "052-keepalive_python-docker_logs",
    level: "info",
    message: "Attempting reconnect (1/3)",
    details: "Session: US-ZqLRz0-3d4d22b79e78\nAttempt: 1 of 3\nTime: 2025-09-06T03:03:28.736Z"
  }
];

export const mockSessionData = {
  sessionId: "US-ZqLRz0",
  status: "Completed",
  startTime: "2025-09-06T02:57:20.000Z",
  endTime: "2025-09-06T03:04:13.000Z",
  duration: "00:06:53",
  userId: "trustengine1075",
  tsInstance: "WINTS-2019-STAG",
  tsUsername: "trustengine1075",
  tsIpAddress: "172.20.2.81",
  tsSessionId: "600",
  logEntries: 50,
  components: 11,
  userInfo: {
    firstName: "Not Available",
    lastName: "",
    email: "Not Available",
    mobile: "",
    dob: "1991-05-14",
    mcc: "+91"
  },
  geoLocation: {
    country: "United States",
    state: "North Carolina",
    city: "Traphill",
    ip: "137.118.191.226",
    isp: "Wilkes Communications",
    timezone: "America/New_York"
  },
  deviceInfo: {
    type: "Mobile",
    os: "iPhone",
    browser: "Safari 18.6",
    screenResolution: "375x812",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.6 Mobile/15E148 Safari/604.1"
  },
  organization: {
    name: "K12",
    useCase: "Address verification",
    maxFiles: 6,
    validDateRange: 30,
    apiKey: "03d26ec04c568d24eeedba7a1c7b0f99"
  }
};

// Hypotheses for the crash scenario analysis (mock)
export const mockHypotheses = [
  {
    title: 'Primary Hypothesis',
    hypothesis: 'TS Session Timeout Exceeded',
    confidence: 95,
    points: [
      'The session started at 06:50:53 and the keepalive flow switch occurred at 07:24:17 (33+ minutes later)',
      'The 30-minute TS session timeout had already expired before the flow switch',
      'The "Upstream error" occurred because the keepalive service tried to connect to an already-expired TS session',
    ],
    evidence: [
      'Exact timing shows 33+ minutes elapsed, exceeding the 30-minute timeout',
    ],
  },
  {
    title: 'Secondary Hypothesis',
    hypothesis: 'Delayed Flow Switch Logic',
    confidence: 80,
    points: [
      'The autoDownloadInitiated indicator was triggered too late in the session lifecycle',
      'The system should have switched to keepalive flow well before the 30-minute timeout',
      'This suggests either a bug in the flow switch detection logic or delayed user interaction',
    ],
    evidence: [
      'Flow switch occurred 3+ minutes after TS timeout would have expired',
    ],
  },
  {
    title: 'Tertiary Hypothesis',
    hypothesis: 'Session Management Race Condition',
    confidence: 60,
    points: [
      'Multiple users were assigned to the same session over time, potentially causing timing conflicts',
      'The session cleanup logic may not have properly handled the transition from diro to keepalive',
    ],
    evidence: [
      'Multiple user assignments throughout the session timeline',
    ],
  },
];

// Alerts across platforms
export const mockAlerts = [
  {
    timestamp: '2025-09-06T06:55:10.000Z',
    platform: 'Slack',
    message: 'High latency observed in Guacamole tunnel for session US-ZqLRz0',
  },
  {
    timestamp: '2025-09-06T07:22:30.000Z',
    platform: 'Sentry',
    message: 'Keepalive websocket error: upstream disconnected unexpectedly',
  },
  {
    timestamp: '2025-09-06T07:24:25.000Z',
    platform: 'New Relic',
    message: 'Spike in TS disconnect events correlated with keepalive flow switch',
  },
];
