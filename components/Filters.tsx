import type { ComponentData } from '../lib/types';
import { formatTimeUTC } from '../lib/format';

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
  const compBg: Record<string, string> = {
    loadbalancer: 'bg-pink-50',
    gateway: 'bg-purple-50',
    booking_engine: 'bg-cyan-50',
    tomcat: 'bg-blue-50',
    guacd: 'bg-green-50',
    guacamole: 'bg-emerald-50',
    terminal_server: 'bg-indigo-50',
    browser: 'bg-teal-50',
    extension: 'bg-orange-50',
    automation: 'bg-rose-50',
    keepalive: 'bg-yellow-50',
  };
  return (
    <div className="grid gap-2 mb-3">
      {/* <div className="text-[12px] uppercase text-slate-500 dark:text-slate-400 tracking-wide">Filters</div> */}
      <div className="grid grid-cols-6 gap-2 max-[1100px]:grid-cols-4 max-[800px]:grid-cols-2">
        {isCompact
          ? componentsData.flatMap((c) => c.logSources.map((s) => ({ c, s }))).map(({ c, s }) => {
              const active = state.sources.size === 0 || state.sources.has(s.id);
              return (
                <button
                  key={s.id}
                  className={`border border-slate-200 dark:border-slate-700 ${compBg[c.id] || 'bg-slate-50'} dark:bg-slate-900 text-slate-800 dark:text-slate-100 px-2 py-1.5 rounded-lg text-left ${active ? 'ring-2 ring-indigo-300' : ''}`}
                  onClick={() => toggleSource(s.id)}
                  title={`${c.displayName} (${s.displayName})`}
                >
                  <span className="block font-semibold text-[12px]">{c.displayName}</span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">{s.displayName}</span>
                </button>
              );
            })
          : componentsData.map((c) => {
              const active = state.components.size === 0 || state.components.has(c.id);
              return (
                <button
                  key={c.id}
                  className={`border border-slate-200 dark:border-slate-700 ${compBg[c.id] || 'bg-slate-50'} dark:bg-slate-900 text-slate-800 dark:text-slate-100 px-2 py-1.5 rounded-lg text-left ${active ? 'ring-2 ring-indigo-300' : ''}`}
                  onClick={() => toggleComp(c.id)}
                  title={`Last seen: ${lastTimestamps[c.id] || '—'}`}
                >
                  <span className="block font-semibold text-[12px]">{c.displayName}</span>
                  {!isCompact && (
                    <span className="block text-[11px] text-slate-500 dark:text-slate-400">{formatTimeUTC(lastTimestamps[c.id])}</span>
                  )}
                </button>
              );
            })}
      </div>
      {!isCompact && (
        <div className="border border-dashed border-slate-200 dark:border-slate-700 p-2 rounded-lg">
          <div className="text-[12px] uppercase text-slate-500 dark:text-slate-400 mb-2">Log Sources</div>
          <div className="grid grid-cols-6 gap-2 max-[1100px]:grid-cols-4 max-[800px]:grid-cols-2">
            {componentsData.flatMap((c) => c.logSources.map((s) => ({ c, s }))).map(({ c, s }) => {
              const active = state.sources.size === 0 || state.sources.has(s.id);
              return (
                <button
                  key={s.id}
                  className={`border border-slate-200 dark:border-slate-700 ${compBg[c.id] || 'bg-slate-50'} dark:bg-slate-900 text-slate-800 dark:text-slate-100 px-2 py-1.5 rounded-lg text-left opacity-90 ${active ? 'ring-2 ring-indigo-300' : ''}`}
                  onClick={() => toggleSource(s.id)}
                >
                  <span className="block font-semibold text-[12px]">{c.displayName}</span>
                  <span className="block text-[11px] text-slate-500 dark:text-slate-400">{s.displayName}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
