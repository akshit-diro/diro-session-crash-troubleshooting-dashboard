import React from 'react';
import { LOG_SOURCE_KINDS, type LogSourceType } from '../lib/logSources';

export type LoadStatus = 'pending' | 'loading' | 'done' | 'error';

export default function LogSourceLoader({
  order,
  status,
  className,
}: {
  order: LogSourceType[];
  status: Record<LogSourceType, LoadStatus>;
  className?: string;
}) {
  const items = order.map((k) => ({ k, label: LOG_SOURCE_KINDS.find((x) => x.key === k)?.label || k }));

  return (
    <div className={"p-3 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 " + (className || '')}>
      <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Fetching logs by source</div>
      <ul className="flex flex-col gap-2">
        {items.map(({ k, label }) => {
          const st = status[k] || 'pending';
          const isDone = st === 'done';
          const isErr = st === 'error';
          const isLoading = st === 'loading';
          const icon = isDone ? '✓' : isErr ? '!' : '';
          const base = 'w-5 h-5 inline-flex items-center justify-center rounded-full border mr-2';
          const color = isDone
            ? 'bg-green-500 border-green-500 text-white'
            : isErr
              ? 'bg-red-500 border-red-500 text-white'
              : 'border-slate-300 dark:border-slate-600 text-transparent';
          return (
            <li key={k} className="flex items-center text-sm text-slate-700 dark:text-slate-300">
              <span className={`${base} ${color}`}>{icon}</span>
              <span>{label}</span>
              {isLoading && <span className="ml-2 text-xs text-slate-500">loading…</span>}
              {isErr && <span className="ml-2 text-xs text-red-500">failed</span>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

