import { useEffect, useState } from 'react';
import type { ComponentData } from '../lib/types';
import { sidebarLinks, resolveSidebarHref } from '../lib/sidebarLinks';

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
          {components.map((c) => {
            const linksForComponent = sidebarLinks.filter((l) => l.component === c.id);
            if (linksForComponent.length === 0) return null;
            return (
              <div key={c.id} className="sidebar-group">
                <div className="sidebar-title">{c.displayName}</div>
                <div className="sidebar-links">
                  {linksForComponent.map((lt) => (
                    <a key={lt.key} href={resolveSidebarHref(lt.href, c)} target="_blank" rel="noreferrer" className="sidebar-link">
                      <span>{lt.label}</span>
                      <span className="ext-icon" aria-hidden>↗</span>
                    </a>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </aside>
  );
}
