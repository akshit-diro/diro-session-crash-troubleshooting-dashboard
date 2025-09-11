import type { SessionData } from '../lib/types';

export default function SessionOverview({ session }: { session: SessionData }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3 bg-slate-50 border border-slate-200 p-3 rounded-lg">
      <div className="inline-flex gap-1.5"><span className="text-slate-500">Session:</span><span className="font-semibold">{session.sessionId}</span></div>
      <div className="inline-flex gap-1.5"><span className="text-slate-500">Status:</span><span className="font-semibold">{session.status || '—'}</span></div>
      <div className="inline-flex gap-1.5"><span className="text-slate-500">Start:</span><span className="font-semibold">{session.startTime ? new Date(session.startTime).toLocaleString() : '—'}</span></div>
      <div className="inline-flex gap-1.5"><span className="text-slate-500">End:</span><span className="font-semibold">{session.endTime ? new Date(session.endTime).toLocaleString() : '—'}</span></div>
      <div className="inline-flex gap-1.5"><span className="text-slate-500">TS Username:</span><span className="font-semibold">{session.tsUsername || '—'}</span></div>
      <div className="inline-flex gap-1.5"><span className="text-slate-500">TS IP:</span><span className="font-semibold">{session.tsIpAddress || '—'}</span></div>
      <div className="inline-flex gap-1.5"><span className="text-slate-500">TS Session:</span><span className="font-semibold">{session.tsSessionId || '—'}</span></div>
    </div>
  );
}
