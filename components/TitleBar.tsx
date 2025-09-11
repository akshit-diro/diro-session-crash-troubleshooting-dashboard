import React from 'react';

export default function TitleBar({
  title,
  sessionId,
  onChange,
  onLoad,
  loading,
  error,
  isMockData,
}: {
  title: string;
  sessionId: string;
  onChange: (v: string) => void;
  onLoad: () => void;
  loading: boolean;
  error?: string | null;
  isMockData?: boolean;
}) {
  return (
    <div className="sticky top-0 z-10 bg-slate-50/60 dark:bg-slate-900/60 backdrop-blur-sm flex items-center justify-between py-1">
      <div>
        <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">{title}</h1>  
        <span className="text-xs text-slate-600 dark:text-slate-400">Note: All timestamps are in UTC.</span>
      </div>
      <div className="flex flex-col gap-2 items-end">
        <div className="flex items-center gap-2">
          <input className="px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 rounded-md w-72" value={sessionId} onChange={(e) => onChange(e.target.value)} placeholder="Enter Session ID" />
          <button className="px-3 py-2 rounded-md border border-slate-200 dark:border-slate-700 bg-blue-50 dark:bg-blue-900/30 text-slate-900 dark:text-slate-100 disabled:opacity-60" onClick={onLoad} disabled={loading}>{loading ? 'Loading…' : 'Load'}</button>
        </div>
        {isMockData && <span className="text-xs text-amber-700">Warning: Displaying mock data</span>}
        {error && <span className="text-xs text-red-700 dark:text-red-400 ml-2">Error: {error}</span>}
      </div>
    </div>
  );
}
