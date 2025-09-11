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
    <div className="topbar">
      <div className="title">{title}</div>
      <div className="session-input">
        <input value={sessionId} onChange={(e) => onChange(e.target.value)} placeholder="Enter Session ID" />
        <button onClick={onLoad} disabled={loading}>{loading ? 'Loading…' : 'Load'}</button>
        {error && <span style={{ color: '#b91c1c', marginLeft: 8 }}>Error: {error}</span>}
      </div>
    </div>
  );
}

