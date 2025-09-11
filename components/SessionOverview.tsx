import { useState } from 'react';
import type { SessionData } from '../lib/types';
import Alerts from './Alerts';
import { formatDateTimeUTC } from '../lib/format';

export default function SessionOverview({ session, alerts = [] as any[] }: { session: SessionData; alerts?: any[] }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <span className="font-medium text-slate-800 dark:text-slate-100">Session Overview</span>
        <div className="relative">
          <button className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" title="Show alerts" onClick={() => setOpen((v) => !v)}>
            <span aria-hidden>🔔</span>
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-[520px] max-w-[90vw] z-20">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow">
                <div className="px-3 py-2 text-[12px] text-slate-500 dark:text-slate-400">Alerts (UTC)</div>
                <div className="p-2">
                  <Alerts alerts={alerts as any} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-3 p-3">
        <div className="inline-flex gap-1.5"><span className="text-slate-500">Session:</span><span className="font-semibold">{session.sessionId}</span></div>
        <div className="inline-flex gap-1.5"><span className="text-slate-500">Status:</span><span className="font-semibold">{session.status || '—'}</span></div>
        <div className="inline-flex gap-1.5"><span className="text-slate-500">Start:</span><span className="font-semibold">{formatDateTimeUTC(session.startTime)}</span></div>
        <div className="inline-flex gap-1.5"><span className="text-slate-500">End:</span><span className="font-semibold">{formatDateTimeUTC(session.endTime)}</span></div>
        <div className="inline-flex gap-1.5"><span className="text-slate-500">TS Username:</span><span className="font-semibold">{session.tsUsername || '—'}</span></div>
        <div className="inline-flex gap-1.5"><span className="text-slate-500">TS IP:</span><span className="font-semibold">{session.tsIpAddress || '—'}</span></div>
        <div className="inline-flex gap-1.5"><span className="text-slate-500">TS Session:</span><span className="font-semibold">{session.tsSessionId || '—'}</span></div>
      </div>
    </div>
  );
}
