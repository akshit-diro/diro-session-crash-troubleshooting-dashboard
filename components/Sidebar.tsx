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
    <aside
      className={`fixed top-0 left-0 h-screen bg-white border-r border-slate-200 z-10 overflow-hidden flex flex-col ${open ? '' : ''}`}
      style={{ width: open ? '260px' : '40px' }}
    >
      <div className={`flex items-center justify-between border-b border-slate-200 ${open ? 'px-3 py-2' : 'justify-center p-1.5'}`}>
        {open && <strong className="text-slate-800">Quick Links</strong>}
        <button className="border border-slate-200 rounded px-2 py-0.5 bg-white text-slate-700" aria-label="toggle" onClick={() => setOpen(!open)}>{open ? '⟨' : '⟩'}</button>
      </div>
      <div className="flex-1 min-h-0 overflow-y-auto px-2 py-2">
        {open && components.map((c) => {
          const linksForComponent = sidebarLinks.filter((l) => l.component === c.id);
          if (linksForComponent.length === 0) return null;
          return (
            <div key={c.id} className="mb-3">
              <div className="text-[12px] font-bold text-slate-500 uppercase mb-1.5">{c.displayName}</div>
              <div className="grid grid-cols-1 gap-1">
                {linksForComponent.map((lt) => (
                  <a key={lt.key} href={resolveSidebarHref(lt.href, c)} target="_blank" rel="noreferrer" className="text-[12px] text-blue-600 no-underline bg-transparent px-2 py-1 rounded-md border border-transparent hover:bg-slate-100 hover:border-slate-200 flex items-center justify-between">
                    <span>{lt.label}</span>
                    <span className="text-slate-500 text-[12px] ml-1" aria-hidden>↗</span>
                  </a>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className={`border-t border-slate-200 ${open ? 'px-2 py-2' : 'p-1.5'}`}>
        <button className="w-full inline-flex items-center justify-center gap-2 px-2 py-2 border border-slate-200 rounded bg-white hover:bg-slate-50" title="Logout" onClick={() => { window.location.href = '/api/logout'; }}>
          <span aria-hidden>⏻</span>
          {open && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
