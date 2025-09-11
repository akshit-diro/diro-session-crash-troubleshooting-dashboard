import { ReactNode, useState } from 'react';

export default function Collapsible({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="section">
      <header className="section-header">
        <span>{title}</span>
        <button className="toggle" aria-label="toggle" onClick={() => setOpen(!open)}>
          {open ? '−' : '+'}
        </button>
      </header>
      {open && <div className="section-body">{children}</div>}
    </section>
  );
}
