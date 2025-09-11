import type { NextApiRequest, NextApiResponse } from 'next';
import { components, getSession, getUnifiedLogsBySession, getLastTimestamps, hypotheses, alerts, isMockMode } from '../../lib/data';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  const id = req.query.id as string | undefined;
  if (!id) return res.status(400).json({ error: 'Missing id' });
  const session = getSession(id);
  const logs = getUnifiedLogsBySession(id);
  const lastTimestamps = getLastTimestamps(logs);
  return res.status(200).json({ session, components, logs, lastTimestamps, hypotheses, alerts, mock: isMockMode });
}
