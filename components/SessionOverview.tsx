import type { SessionData } from '../lib/types';
import { formatDateTimeUTC } from '../lib/format';

export default function SessionOverview({ session, onOpenAlerts }: Readonly<{ session: SessionData; onOpenAlerts?: () => void }>) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <span className="font-medium text-slate-800 dark:text-slate-100">Session Overview</span>
        <button className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" title="Show alerts" onClick={onOpenAlerts}>
          <span aria-hidden>🔔</span>
        </button>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3 p-3">
        <div className="inline-flex gap-1.5"><span className="text-slate-500">Session:</span><span className="font-semibold">{session.sessionId}</span></div>
        <div className="inline-flex gap-1.5"><span className="text-slate-500">Last Indicator:</span><span className="font-semibold">{session.status || '—'}</span></div>
        <div className="inline-flex gap-1.5"><span className="text-slate-500">Started Indicator Time:</span><span className="font-semibold">{formatDateTimeUTC(session.startTime)}</span></div>
        <div className="inline-flex gap-1.5"><span className="text-slate-500">Last Indicator Time:</span><span className="font-semibold">{formatDateTimeUTC(session.endTime)}</span></div>
        <div className="inline-flex gap-1.5"><span className="text-slate-500">TS Username:</span><span className="font-semibold">{session.tsUsername || '—'}</span></div>
        <div className="inline-flex gap-1.5"><span className="text-slate-500">Source VM:</span><span className="font-semibold">{session.sourceVM || '—'}</span></div>
        <div className="inline-flex gap-1.5"><span className="text-slate-500">TS Session:</span><span className="font-semibold">{session.tsSessionId || '—'}</span></div>
      </div>
    </div>
  );
}
