import type { AlertItem } from '../lib/types';
import { formatDateTimeUTC } from '../lib/format';

export default function Alerts({ alerts }: { alerts: AlertItem[] }) {
  if (!alerts || alerts.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 p-3 rounded-lg text-slate-500">
        No alert integrations in mock mode
      </div>
    );
  }
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg divide-y divide-slate-200">
      {alerts.map((a, idx) => (
        <div key={idx} className="p-3 flex items-start gap-3 text-sm">
          <div className="text-slate-500 w-48 shrink-0">{formatDateTimeUTC(a.timestamp)}</div>
          <div className="font-medium w-32 shrink-0">{a.platform}</div>
          <div className="text-slate-800">{a.message}</div>
        </div>
      ))}
    </div>
  );
}
