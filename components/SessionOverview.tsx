import type { SessionData } from '../lib/types';

export default function SessionOverview({ session }: { session: SessionData }) {
  return (
    <div className="overview-strip">
      <div className="kv"><span className="k">Session:</span><span className="v">{session.sessionId}</span></div>
      <div className="kv"><span className="k">Status:</span><span className="v">{session.status || '—'}</span></div>
      <div className="kv"><span className="k">Start:</span><span className="v">{session.startTime ? new Date(session.startTime).toLocaleString() : '—'}</span></div>
      <div className="kv"><span className="k">End:</span><span className="v">{session.endTime ? new Date(session.endTime).toLocaleString() : '—'}</span></div>
      <div className="kv"><span className="k">TS Username:</span><span className="v">{session.tsUsername || '—'}</span></div>
      <div className="kv"><span className="k">TS IP:</span><span className="v">{session.tsIpAddress || '—'}</span></div>
      <div className="kv"><span className="k">TS Session:</span><span className="v">{session.tsSessionId || '—'}</span></div>
    </div>
  );
}
