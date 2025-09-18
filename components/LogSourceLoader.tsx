import React from 'react';
import { LOG_SOURCE_KINDS, type LogSourceType } from '../lib/logSources';

export type LoadStatus = 'pending' | 'loading' | 'done' | 'error';

export interface SessionDocStatus {
  status: LoadStatus;
}

interface LogSourceLoaderProps {
  readonly order: LogSourceType[];
  readonly status: Record<LogSourceType, LoadStatus>;
  readonly sessionDocStatus?: SessionDocStatus;
  readonly className?: string;
}

export default function LogSourceLoader({
  order,
  status,
  sessionDocStatus,
  className,
}: LogSourceLoaderProps) {
  const items = order.map((k) => ({ k, label: LOG_SOURCE_KINDS.find((x) => x.key === k)?.label || k }));

  const renderStatusItem = (key: string, label: string, st: LoadStatus) => {
    const isDone = st === 'done';
    const isErr = st === 'error';
    const isLoading = st === 'loading';
    
    let icon = '';
    if (isDone) icon = '✓';
    else if (isErr) icon = '!';
    
    const base = 'w-5 h-5 inline-flex items-center justify-center rounded-full border mr-2';
    
    let color = 'border-slate-300 dark:border-slate-600 text-transparent';
    if (isDone) color = 'bg-green-500 border-green-500 text-white';
    else if (isErr) color = 'bg-red-500 border-red-500 text-white';
    return (
      <li key={key} className="flex items-center text-sm text-slate-700 dark:text-slate-300">
        <span className={`${base} ${color}`}>{icon}</span>
        <span>{label}</span>
        {isLoading && <span className="ml-2 text-xs text-slate-500">loading…</span>}
        {isErr && <span className="ml-2 text-xs text-red-500">failed</span>}
      </li>
    );
  };

  return (
    <div className={"p-3 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 " + (className || '')}>
      <div className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">Fetching logs by source</div>
      <ul className="flex flex-col gap-2">
        {sessionDocStatus && renderStatusItem('session-doc', 'Session Document', sessionDocStatus.status)}
        {items.map(({ k, label }) => renderStatusItem(k, label, status[k] || 'pending'))}
      </ul>
    </div>
  );
}

