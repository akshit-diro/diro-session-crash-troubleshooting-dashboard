import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Respond 401 so the browser forgets Basic Auth for this tab and re-prompts.
  res.status(401)
    .setHeader('WWW-Authenticate', 'Basic realm="Diro Session Crash Troubleshooting"')
    .send('Logged out');
}

