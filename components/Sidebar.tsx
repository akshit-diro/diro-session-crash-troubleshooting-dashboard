import { useEffect, useState } from 'react';
import type { ComponentData } from '../lib/types';

const linkTargets = [
  { key: 'newrelic', label: 'New Relic', href: (c: string) => `https://one.newrelic.com/?query=${encodeURIComponent(c)}` },
  { key: 'otel', label: 'OpenTelemetry', href: (c: string) => `https://otel.example.com/?service=${encodeURIComponent(c)}` },
  { key: 'graylog', label: 'Graylog', href: (c: string) => `https://graylog.example.com/search?q=${encodeURIComponent(c)}` },
  { key: 'diro-codes', label: 'Diro Error Codes', href: () => `https://docs.diro.io/errors` },
  { key: 'autonav-codes', label: 'Auto-Nav Codes', href: () => `https://docs.diro.io/autonav/errors` }
];

export default function Sidebar({ components }: { components: ComponentData[] }) {
  const [open, setOpen] = useState(true);

  // Keep main content aligned with current sidebar width via CSS var
  useEffect(() => {
    const w = open ? '260px' : '40px';
    document.documentElement.style.setProperty('--sidebar-w', w);
  }, [open]);

  return (
    <aside className={`sidebar ${open ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <strong>Quick Links</strong>
        <button className="toggle" aria-label="toggle" onClick={() => setOpen(!open)}>{open ? '⟨' : '⟩'}</button>
      </div>
      {open && (
        <div className="sidebar-body">
          {components.map((c) => (
            <div key={c.id} className="sidebar-group">
              <div className="sidebar-title">{c.displayName}</div>
              <div className="sidebar-links">
                {linkTargets.map((lt) => (
                  <a key={lt.key} href={lt.href(c.name)} target="_blank" rel="noreferrer" className="sidebar-link">
                    <span>{lt.label}</span>
                    <span className="ext-icon" aria-hidden>↗</span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}
