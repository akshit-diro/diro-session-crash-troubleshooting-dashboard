import { useMemo, useState } from 'react';
import Filters, { type FiltersState } from './Filters';
import Timeline from './Timeline';
import type { ComponentData, LogEntry } from '../lib/types';
import Collapsible from './Collapsible';

export default function UnifiedTimeline({
  components,
  logs,
  lastTimestamps,
}: {
  components: ComponentData[];
  logs: LogEntry[];
  lastTimestamps: Record<string, string>;
}) {
  const [filters, setFilters] = useState<FiltersState>({ components: new Set(), sources: new Set() });

  const filteredLogs = useMemo(() => {
    const compActive = filters.components.size > 0;
    const srcActive = filters.sources.size > 0;
    return logs.filter((l) => {
      const compOk = !compActive || filters.components.has(l.component);
      const srcOk = !srcActive || filters.sources.has(l.logSource);
      return compOk && srcOk;
    });
  }, [logs, filters]);

  return (
    <>

    <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Unified Timeline</h2>

      <Collapsible title="Filters" defaultOpen>
        <Filters
          mode="compact"
          componentsData={components}
          lastTimestamps={lastTimestamps}
          state={filters}
          onChange={setFilters}
        />
        {(filters.components.size > 0 || filters.sources.size > 0) && (
          <div className="mb-2 flex items-center justify-end">
            <button
              className="text-xs px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200"
              onClick={() => setFilters({ components: new Set(), sources: new Set() })}
            >
              Clear Filters
            </button>
          </div>
        )}
      </Collapsible>
      <Timeline entries={filteredLogs} components={components} />
    </>
  );
}
