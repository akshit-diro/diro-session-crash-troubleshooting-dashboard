import { useEffect, useState } from 'react';
import Alerts from './Alerts';
import type { AlertItem } from '../lib/types';

export default function RightAlertsSidebar({
  alerts,
  open,
  onClose,
}: {
  alerts: AlertItem[];
  open: boolean;
  onClose: () => void;
}) {
  const [width, setWidth] = useState(open ? 360 : 0);

  useEffect(() => {
    const w = open ? 360 : 0;
    setWidth(w);
    // Expose to layout so main can avoid overlap
    document.documentElement.style.setProperty('--rightbar-w', `${w}px`);
    return () => {
      // Cleanup on unmount
      document.documentElement.style.setProperty('--rightbar-w', '0px');
    };
  }, [open]);

  if (!open && width === 0) return null;

  return (
    <aside
      className="fixed top-0 right-0 h-screen bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 z-20 flex flex-col transition-[width] duration-200 ease-out overflow-hidden"
      style={{ width }}
      aria-label="Alerts Sidebar"
    >
      <div className="flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <strong className="text-slate-800 dark:text-slate-100 text-sm">Alerts</strong>
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200"
            title="Close alerts"
            onClick={onClose}
          >
            ✕
          </button>
        </div>
      </div>
      <div className="p-2 min-h-0 overflow-y-auto flex-1">
        <Alerts alerts={alerts} />
      </div>
    </aside>
  );
}

