import type { AlertItem } from '../lib/types';
import { formatDateTimeUTC } from '../lib/format';

function platformBadgeCls(p: string) {
  const key = p.toLowerCase();
  if (key.includes('slack')) return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-100';
  if (key.includes('sentry')) return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-100';
  if (key.includes('new relic')) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-100';
  return 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200';
}

function platformIcon(p: string) {
  const key = p.toLowerCase();
  if (key.includes('slack')) return '💬';
  if (key.includes('sentry')) return '🚨';
  if (key.includes('new relic')) return '📈';
  return '🔔';
}

export default function Alerts({ alerts }: { alerts: AlertItem[] }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-lg text-slate-500 dark:text-slate-400">
        No alert integrations in mock mode
      </div>
    );
  }
  return (
    <ul className="grid gap-2">
      {alerts.map((a, idx) => (
        <li key={idx} className="flex items-start gap-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-lg p-2">
          <span className="text-lg" aria-hidden>{platformIcon(a.platform)}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mb-0.5">
              <span className={`px-1.5 py-0.5 rounded-full border border-transparent uppercase font-medium ${platformBadgeCls(a.platform)}`}>{a.platform}</span>
              <span>{formatDateTimeUTC(a.timestamp)}</span>
            </div>
            <div className="text-[13px] text-slate-800 dark:text-slate-100 break-words">{a.message}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}
