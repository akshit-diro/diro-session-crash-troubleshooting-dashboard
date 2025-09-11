import type { ComponentData } from '../lib/types';

export interface FiltersState {
  components: Set<string>;
  sources: Set<string>;
}

export default function Filters({
  componentsData,
  lastTimestamps,
  state,
  onChange,
  mode = 'full'
}: {
  componentsData: ComponentData[];
  lastTimestamps: Record<string, string>;
  state: FiltersState;
  onChange: (next: FiltersState) => void;
  mode?: 'full' | 'compact';
}) {
  const toggleComp = (id: string) => {
    const next = new Set(state.components);
    next.has(id) ? next.delete(id) : next.add(id);
    onChange({ ...state, components: next });
  };
  const toggleSource = (id: string) => {
    const next = new Set(state.sources);
    next.has(id) ? next.delete(id) : next.add(id);
    onChange({ ...state, sources: next });
  };
  const isCompact = mode === 'compact';
  return (
    <div className={`filters ${isCompact ? 'compact' : ''}`}>
      <div className="filters-title">Filters</div>
      <div className="filter-grid">
        {componentsData.map((c) => (
          <button
            key={c.id}
            className={`chip comp-${c.id} ${state.components.size === 0 || state.components.has(c.id) ? 'active' : ''}`}
            onClick={() => toggleComp(c.id)}
            title={`Last seen: ${lastTimestamps[c.id] || '—'}`}
          >
            <span className="chip-title">{c.displayName}</span>
            {!isCompact && (
              <span className="chip-sub">{lastTimestamps[c.id] ? new Date(lastTimestamps[c.id]).toLocaleTimeString() : '—'}</span>
            )}
          </button>
        ))}
      </div>
      {!isCompact && (
        <div className="filter-group">
          <div className="filter-title">Log Sources</div>
          <div className="filter-grid">
            {componentsData.flatMap((c) => c.logSources.map((s) => ({ c, s }))).map(({ c, s }) => (
              <button key={s.id} className={`chip light ${state.sources.size === 0 || state.sources.has(s.id) ? 'active' : ''}`} onClick={() => toggleSource(s.id)}>
                <span className="chip-title">{c.displayName}</span>
                <span className="chip-sub">{s.displayName}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
