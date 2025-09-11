import { ReactNode, useState } from 'react';

export default function Collapsible({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
      <header className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <span className="font-medium text-slate-800 dark:text-slate-100">{title}</span>
        <button className="border border-slate-200 dark:border-slate-700 rounded px-2 py-0.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200" aria-label="toggle" onClick={() => setOpen(!open)}>
          {open ? '−' : '+'}
        </button>
      </header>
      {open && <div className="p-3">{children}</div>}
    </section>
  );
}
