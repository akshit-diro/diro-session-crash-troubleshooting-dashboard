import type { ComponentData, LogEntry } from '../lib/types';

function inferExitStyle(last: LogEntry | undefined): 'Exited gracefully' | 'Graceful exit logs not found' {
  if (!last) return 'Graceful exit logs not found';
  const msg = `${last.level} ${last.message}`.toLowerCase();
  const gracefulHints = ['graceful', 'closed', 'cleanup', 'stopped', 'disconnect'];
  if (last.level === 'success' || gracefulHints.some((h) => msg.includes(h))) return 'Exited gracefully';
  return 'Graceful exit logs not found';
}

export default function CrashAnalysis({ components, logs }: { components: ComponentData[]; logs: LogEntry[] }) {
  const lastByComp = new Map<string, LogEntry | undefined>();
  for (const c of components) {
    const cs = logs.filter((l) => l.component === c.id);
    cs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    lastByComp.set(c.id, cs[0]);
  }
  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
      <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 font-medium text-slate-800 dark:text-slate-100">Crash Analysis</div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            <tr>
              <th className="text-left px-3 py-2">Component Name</th>
              <th className="text-left px-3 py-2">Exit Style</th>
              <th className="text-left px-3 py-2">Last Log Timestamp (UTC)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {components.map((c) => {
              const last = lastByComp.get(c.id);
              const exitStyle = inferExitStyle(last);
              return (
                <tr key={c.id} className="text-slate-800 dark:text-slate-100">
                  <td className="px-3 py-2 font-medium">{c.displayName}</td>
                  <td className="px-3 py-2">{exitStyle}</td>
                  <td className="px-3 py-2 text-slate-600 dark:text-slate-300">{last ? new Date(last.timestamp).toISOString() : '—'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

