import React from 'react';

export default function TitleBar({
  title,
  sessionId,
  onChange,
  onLoad,
  loading,
  error,
}: {
  title: string;
  sessionId: string;
  onChange: (v: string) => void;
  onLoad: () => void;
  loading: boolean;
  error?: string | null;
}) {
  return (
    <div className="sticky top-0 z-10 bg-slate-50/60 backdrop-blur-sm flex items-center justify-between py-1">
      <div className="text-lg font-bold text-slate-900">{title}</div>
      <div className="flex items-center gap-2">
        <input className="px-3 py-2 border border-slate-200 rounded-md w-72" value={sessionId} onChange={(e) => onChange(e.target.value)} placeholder="Enter Session ID" />
        <button className="px-3 py-2 rounded-md border border-slate-200 bg-blue-50 disabled:opacity-60" onClick={onLoad} disabled={loading}>{loading ? 'Loading…' : 'Load'}</button>
        {error && <span className="text-red-700 ml-2">Error: {error}</span>}
      </div>
    </div>
  );
}
