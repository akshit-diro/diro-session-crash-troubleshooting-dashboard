import { useState } from 'react';
import type { LogEntry, ComponentData } from '../lib/types';
import { formatTimeUTC } from '../lib/format';

function classForComponent(compId: string) {
  return compId;
}

export default function Timeline({ entries, components }: { entries: LogEntry[]; components: ComponentData[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const compMap = new Map(components.map((c) => [c.id, c]));
  return (
    <div className="h-full overflow-auto pb-16">
      {entries.length === 0 && (
        <div className="text-slate-500 text-sm px-1 py-3">No logs to display. Adjust Filters to see results.</div>
      )}
      {entries.map((e) => {
        const c = compMap.get(e.component) || compMap.get(e.component as any);
        const cls = classForComponent(e.component);
        const open = openId === e.id;
        const compAccent: Record<string, string> = {
          loadbalancer: 'border-l-pink-300',
          gateway: 'border-l-purple-300',
          booking_engine: 'border-l-cyan-300',
          tomcat: 'border-l-blue-300',
          guacd: 'border-l-green-300',
          guacamole: 'border-l-emerald-300',
          terminal_server: 'border-l-indigo-300',
          browser: 'border-l-teal-300',
          extension: 'border-l-orange-300',
          automation: 'border-l-rose-300',
          keepalive: 'border-l-yellow-300',
        };
        const levelCls = e.level === 'info'
          ? 'bg-sky-100 text-sky-900 dark:bg-sky-900/40 dark:text-sky-100'
          : e.level === 'success'
          ? 'bg-green-100 text-green-900 dark:bg-green-900/40 dark:text-green-100'
          : e.level === 'warning'
          ? 'bg-yellow-100 text-yellow-900 dark:bg-yellow-900/40 dark:text-yellow-100'
          : 'bg-red-100 text-red-900 dark:bg-red-900/40 dark:text-red-100';
        return (
          <div key={e.id} className={`border border-slate-200 dark:border-slate-700 border-l-4 rounded-lg px-2 py-1.5 mb-1.5 bg-white dark:bg-slate-900 cursor-pointer ${compAccent[cls] || ''}`} onClick={() => setOpenId(open ? null : e.id)}>
            <div className="grid grid-cols-[90px_180px_80px_1fr] items-center gap-2 text-[12px]">
              <span className="text-slate-500 dark:text-slate-400">{formatTimeUTC(e.timestamp)}</span>
              <span className="font-medium">{c?.displayName || e.component}</span>
              <span className={`px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-700 uppercase text-[10px] justify-self-start ${levelCls}`}>{e.level}</span>
              <span className="truncate">{e.message}</span>
            </div>
            {open && (
              <pre className="mt-2 text-[12px] bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2 rounded-lg whitespace-pre-wrap">{e.details}</pre>
            )}
          </div>
        );
      })}
    </div>
  );
}
