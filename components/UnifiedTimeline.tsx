import { useMemo, useState } from 'react';
import Filters, { type FiltersState } from './Filters';
import Timeline from './Timeline';
import type { ComponentData, LogEntry } from '../lib/types';
import Collapsible from './Collapsible';

interface UnifiedTimelineProps {
  readonly components: ComponentData[];
  readonly logs: LogEntry[];
  readonly lastTimestamps: Record<string, string>;
}

export default function UnifiedTimeline({
  components,
  logs,
  lastTimestamps,
}: UnifiedTimelineProps) {
  const [filters, setFilters] = useState<FiltersState>({ components: new Set(), sources: new Set() });

  const filteredLogs = useMemo(() => {
    const compActive = filters.components.size > 0;
    const srcActive = filters.sources.size > 0;
    return logs.filter((l) => {
      // Special handling for AutoNav components
      const hasAutoNavExtension = compActive && filters.components.has('an_extension');
      const hasAutoNavServer = compActive && filters.components.has('an_python');
      
      if (hasAutoNavExtension || hasAutoNavServer) {
        let matchesSpecialFilter = false;
        
        // Check AutoNav Extension filter
        if (hasAutoNavExtension && l.component === 'an_extension') {
          try {
            const details = JSON.parse(l.details || '{}');
            const originalComponent = (details.original_component || details.source || '').toLowerCase();
            
            // For real Graylog data, check original_component
            if (originalComponent) {
              const isAutoNavExtension = originalComponent.includes('auto-nav') && 
                                       originalComponent.includes('chrome') && 
                                       originalComponent.includes('extension');
              if (isAutoNavExtension) {
                matchesSpecialFilter = true;
              }
            } else {
              // For mock data, if it's an_extension component, assume it matches
              matchesSpecialFilter = true;
            }
          } catch {
            // For mock data or unparseable details, if it's an_extension component, assume it matches
            matchesSpecialFilter = true;
          }
        }
        
        // Check AutoNav Server filter
        if (hasAutoNavServer && l.component === 'an_python') {
          try {
            const details = JSON.parse(l.details || '{}');
            const originalComponent = (details.original_component || details.source || '').toLowerCase();
            
            // For real Graylog data, check original_component for M58_auto_navigate_python
            if (originalComponent) {
              const isAutoNavServer = originalComponent.includes('m58_auto_navigate_python');
              if (isAutoNavServer) {
                matchesSpecialFilter = true;
              }
            } else {
              // For mock data, if it's an_python component, assume it matches
              matchesSpecialFilter = true;
            }
          } catch {
            // For mock data or unparseable details, if it's an_python component, assume it matches
            matchesSpecialFilter = true;
          }
        }
        
        if (!matchesSpecialFilter) {
          return false;
        }
        
        // If other components are also selected, check those too
        const otherComponents = new Set(filters.components);
        otherComponents.delete('an_extension');
        otherComponents.delete('an_python');
        if (otherComponents.size > 0) {
          const otherCompOk = otherComponents.has(l.component);
          if (!otherCompOk) return false;
        }
      } else {
        // Regular component filtering for non-AutoNav components
        const compOk = !compActive || filters.components.has(l.component);
        if (!compOk) return false;
      }
      
      // Source filtering (unchanged)
      const srcOk = !srcActive || filters.sources.has(l.logSource);
      return srcOk;
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
