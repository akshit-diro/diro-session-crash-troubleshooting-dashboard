import { useMemo, useState } from 'react';
import Filters, { type FiltersState } from './Filters';
import Timeline from './Timeline';
import type { ComponentData, LogEntry } from '../lib/types';

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
      <Filters
        mode="compact"
        componentsData={components}
        lastTimestamps={lastTimestamps}
        state={filters}
        onChange={setFilters}
      />
      <Timeline entries={filteredLogs} components={components} />
    </>
  );
}
