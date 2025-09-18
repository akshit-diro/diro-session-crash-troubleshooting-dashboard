import type { LogEntry, SessionData, ComponentData, HypothesisItem, AlertItem } from './types';

// Import from existing root mockData.ts to avoid duplication
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mock = require('../mockData');

export const components: ComponentData[] = mock.components || [];
export const allEntries: LogEntry[] = mock.mockLogEntries || [];
export const mockSessionData: SessionData | undefined = mock.mockSessionData;
export const hypotheses: HypothesisItem[] = mock.mockHypotheses || [];
export const alerts: AlertItem[] = mock.mockAlerts || [];
export const isMockMode: boolean = process.env.MOCK_MODE ? process.env.MOCK_MODE === 'true' : false;

export function getUnifiedLogsBySession(sessionId: string): LogEntry[] {
  const entries: LogEntry[] = (allEntries || []).filter((e: LogEntry) => {
    const s = JSON.stringify(e);
    return s.includes(sessionId);
  });
  entries.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  return entries;
}

// Configuration for session API
interface SessionApiConfig {
  baseUrl: string;
  endpoint: string;
}

function getSessionApiConfig(): SessionApiConfig {
  const baseUrl = process.env.SESSION_API_BASE_URL || 'https://prod.dirolabs.com';
  const endpoint = process.env.SESSION_API_ENDPOINT || '/Zuul-1.0/User-2.0/getlastclickedlink';
  
  return { baseUrl, endpoint };
}

// Separate function to fetch session document from API
export async function fetchSessionDocument(sessionId: string): Promise<any> {
  const config = getSessionApiConfig();
  const url = `${config.baseUrl}${config.endpoint}`;
  
  console.log(`Fetching session document for ${sessionId} from ${url}`);
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      sessionid: sessionId
    })
  });

  if (!response.ok) {
    throw new Error(`Session API request failed: ${response.status} ${response.statusText}`);
  }

  return await response.json();
}

// Extract session data from the session document
function extractSessionData(sessionDoc: any, sessionId: string): SessionData {
  const indicator = sessionDoc.indicator || {};
  const captureIndicators = sessionDoc.captureIndicators || [];
  const vmType = sessionDoc.vmType || {};
  
  // Get status from indicator.progress_name
  const status = indicator.progress_name || 'Unknown';
  
  // Get end time from indicator.time (convert from timestamp to ISO string)
  let endTime = '';
  if (indicator.time) {
    let endTimestamp = typeof indicator.time === 'string' ? parseInt(indicator.time) : indicator.time;
    // If timestamp is in seconds (10 digits), convert to milliseconds
    if (endTimestamp.toString().length === 10) {
      endTimestamp = endTimestamp * 1000;
    }
    endTime = new Date(endTimestamp).toISOString();
  }
  
  // Get start time from captureIndicators - find "Started" with progress_no "2"
  const startIndicator = captureIndicators.find((item: any) => 
    item.progress_name === 'Started' && item.progress_no === '2'
  );
  
  let startTime = '';
  if (startIndicator?.time) {
    let startTimestamp = typeof startIndicator.time === 'string' ? parseInt(startIndicator.time) : startIndicator.time;
    // If timestamp is in seconds (10 digits), convert to milliseconds
    if (startTimestamp.toString().length === 10) {
      startTimestamp = startTimestamp * 1000;
    }
    startTime = new Date(startTimestamp).toISOString();
  }
  
  // Get source VM from vmType
  const sourceVM = vmType.sourceVM || '';
  
  return {
    sessionId,
    status,
    startTime,
    endTime,
    // Calculate duration if both times are available
    duration: startTime && endTime ? calculateDuration(startTime, endTime) : undefined,
    // Add source VM info
    sourceVM
  };
}

export async function getSession(sessionId: string): Promise<SessionData> {
  // Return mock data if available and matching
  if (isMockMode && mockSessionData && mockSessionData.sessionId === sessionId) {
    return mockSessionData;
  }
  
  try {
    const sessionDoc = await fetchSessionDocument(sessionId);
    return extractSessionData(sessionDoc, sessionId);
  } catch (error) {
    console.error('Failed to fetch session data:', error);
    
    // Fallback to default session data if API fails
    return { 
      sessionId, 
      status: 'Active', // Default to Active instead of Unknown
      startTime: new Date().toISOString(), 
      endTime: '' 
    };
  }
}

// Helper function to calculate duration between two timestamps
function calculateDuration(startTime: string, endTime: string): string {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end.getTime() - start.getTime();
  
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function getLastTimestamps(entries: LogEntry[]): Record<string, string> {
  const last: Record<string, string> = {};
  for (const e of entries) last[e.component] = e.timestamp;
  return last;
}
