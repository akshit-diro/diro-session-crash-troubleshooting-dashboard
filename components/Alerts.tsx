import type { AlertItem } from '../lib/types';
import { formatDateTimeUTC } from '../lib/format';

export default function Alerts({ alerts }: { alerts: AlertItem[] }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-3 rounded-lg text-slate-500 dark:text-slate-400">
        No alert integrations in mock mode
      </div>
    );
  }
  return (
    <div className="overflow-x-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
          <tr>
            <th className="text-left px-3 py-2">Time (UTC)</th>
            <th className="text-left px-3 py-2">Platform</th>
            <th className="text-left px-3 py-2">Message</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {alerts.map((a, idx) => (
            <tr key={idx} className="text-slate-800 dark:text-slate-100">
              <td className="px-3 py-2 text-slate-600 dark:text-slate-300 w-56">{formatDateTimeUTC(a.timestamp)}</td>
              <td className="px-3 py-2 font-medium w-32">{a.platform}</td>
              <td className="px-3 py-2">{a.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
