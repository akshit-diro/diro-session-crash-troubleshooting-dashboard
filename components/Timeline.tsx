import { useState } from 'react';
import type { LogEntry, ComponentData } from '../lib/types';

function classForComponent(compId: string) {
  return `comp-${compId}`;
}

export default function Timeline({ entries, components }: { entries: LogEntry[]; components: ComponentData[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const compMap = new Map(components.map((c) => [c.id, c]));
  return (
    <div className="timeline">
      {entries.map((e) => {
        const c = compMap.get(e.component) || compMap.get(e.component as any);
        const cls = classForComponent(e.component);
        const open = openId === e.id;
        return (
          <div key={e.id} className={`log ${cls} ${open ? 'open' : ''}`} onClick={() => setOpenId(open ? null : e.id)}>
            <div className="log-head">
              <span className="log-time">{new Date(e.timestamp).toLocaleTimeString()}</span>
              <span className="log-comp">{c?.displayName || e.component}</span>
              <span className={`log-level ${e.level}`}>{e.level}</span>
              <span className="log-msg">{e.message}</span>
            </div>
            {open && (
              <pre className="log-details">{e.details}</pre>
            )}
          </div>
        );
      })}
    </div>
  );
}

