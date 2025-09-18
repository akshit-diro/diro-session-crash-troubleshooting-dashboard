import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchLogsForType } from '../../../lib/fetchers';
import type { LogSourceType } from '../../../lib/logSources';
import { fetchTSLogsFromGraylog } from '../../../lib/adapters/graylog';
import { fetchSessionDocument } from '../../../lib/data';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const sessionId = (req.query.session as string) || (req.query.id as string);
  const t = (req.query.type as string | undefined)?.toLowerCase() as LogSourceType | undefined;
  if (!sessionId) return res.status(400).json({ error: 'Missing session' });
  if (!t) return res.status(400).json({ error: 'Missing type' });
  
  try {
    const logs = await fetchLogsForType(sessionId, t as LogSourceType);
    
    // If this is a graylog request, also fetch TS logs
    if (t === 'graylog') {
      try {
        // Get session document to extract start time
        const sessionDoc = await fetchSessionDocument(sessionId);
        const captureIndicators = sessionDoc.captureIndicators || [];
        
        // Find "Started" indicator with progress_no "2"
        const startIndicator = captureIndicators.find((item: any) => 
          item.progress_name === 'Started' && item.progress_no === '2'
        );
        
        let tsLogs: any[] = [];
        if (startIndicator?.time) {
          console.log(`Raw startIndicator.time: ${startIndicator.time} (type: ${typeof startIndicator.time})`);
          
          // Handle both string and number timestamps, and check if it's in seconds or milliseconds
          let timestamp = typeof startIndicator.time === 'string' ? parseInt(startIndicator.time) : startIndicator.time;
          
          // If timestamp is in seconds (10 digits), convert to milliseconds
          if (timestamp.toString().length === 10) {
            timestamp = timestamp * 1000;
            console.log(`Converted timestamp from seconds to milliseconds: ${timestamp}`);
          }
          
          const startTime = new Date(timestamp).toISOString();
          console.log(`Final startTime for TS logs: ${startTime}`);
          console.log(`Fetching TS logs for session ${sessionId} with start time: ${startTime}`);
          tsLogs = await fetchTSLogsFromGraylog(startTime);
        } else {
          console.warn(`No started indicator found for session ${sessionId}, skipping TS logs`);
        }
        
        return res.status(200).json({ 
          logs,
          TSLogs: tsLogs 
        });
        
      } catch (tsError) {
        console.error('Failed to fetch TS logs:', tsError);
        // Still return the regular logs even if TS logs fail
        return res.status(200).json({ 
          logs,
          TSLogs: [] 
        });
      }
    }
    
    // For non-graylog requests, return just logs
    return res.status(200).json({ logs });
    
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Failed to fetch logs' });
  }
}
