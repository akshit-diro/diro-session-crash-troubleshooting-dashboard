import { ReactNode, useState } from 'react';

export default function Collapsible({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="bg-white border border-slate-200 rounded-lg overflow-hidden">
      <header className="flex items-center justify-between px-3 py-2 bg-slate-50 border-b border-slate-200">
        <span className="font-medium text-slate-800">{title}</span>
        <button className="border border-slate-200 rounded px-2 py-0.5 bg-white text-slate-700" aria-label="toggle" onClick={() => setOpen(!open)}>
          {open ? '−' : '+'}
        </button>
      </header>
      {open && <div className="p-3">{children}</div>}
    </section>
  );
}
