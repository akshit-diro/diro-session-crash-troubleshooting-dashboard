import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchLogsForType } from '../../../lib/fetchers';
import type { LogSourceType } from '../../../lib/logSources';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const sessionId = (req.query.session as string) || (req.query.id as string);
  const t = (req.query.type as string | undefined)?.toLowerCase() as LogSourceType | undefined;
  if (!sessionId) return res.status(400).json({ error: 'Missing session' });
  if (!t) return res.status(400).json({ error: 'Missing type' });
  try {
    const logs = await fetchLogsForType(sessionId, t as LogSourceType);
    return res.status(200).json({ logs });
  } catch (e: any) {
    return res.status(500).json({ error: e?.message || 'Failed to fetch logs' });
  }
}
