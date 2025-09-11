import { useEffect, useMemo, useState } from 'react';
import Collapsible from '../components/Collapsible';
import Sidebar from '../components/Sidebar';
import Filters, { type FiltersState } from '../components/Filters';
import Timeline from '../components/Timeline';
import SessionOverview from '../components/SessionOverview';
import type { ComponentData, LogEntry, SessionData } from '../lib/types';

interface SessionResponse {
  session: SessionData;
  components: ComponentData[];
  logs: LogEntry[];
  lastTimestamps: Record<string, string>;
}

export default function Home() {
  const [sessionId, setSessionId] = useState('US-ZqLRz0');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SessionResponse | null>(null);
  const [filters, setFilters] = useState<FiltersState>({ components: new Set(), sources: new Set() });

  const fetchSession = async (id: string) => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`/api/session?id=${encodeURIComponent(id)}`);
      if (!res.ok) throw new Error(`${res.status}`);
      const json: SessionResponse = await res.json();
      setData(json);
    } catch (e: any) {
      setError(e.message || 'Failed');
      setData(null);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchSession(sessionId); }, []);

  const filteredLogs = useMemo(() => {
    if (!data) return [] as LogEntry[];
    const compActive = filters.components.size > 0;
    const srcActive = filters.sources.size > 0;
    return data.logs.filter((l) => {
      const compOk = !compActive || filters.components.has(l.component);
      const srcOk = !srcActive || filters.sources.has(l.logSource);
      return compOk && srcOk;
    });
  }, [data, filters]);

  const hypothesis = useMemo(() => {
    if (!data) return '—';
    const hasGuacError = data.logs.some((l) => l.component.includes('guacamole') && l.level === 'error');
    const tsDisconnect = data.logs.find((l) => l.component.includes('terminal_server') && /disconnect/i.test(l.message));
    const keepaliveFail = data.logs.find((l) => l.component.includes('keepalive') && l.level === 'error');
    if (hasGuacError && tsDisconnect) return 'Guacamole client error likely triggered TS disconnection.';
    if (keepaliveFail) return 'Keep-alive websocket instability observed; may contribute to session drop.';
    return 'No obvious crash root-cause; review warnings around disconnect timeframe.';
  }, [data]);

  return (
    <div className="layout">
      <Sidebar components={data?.components || []} />
      <main className="main">
        <div className="topbar">
          <div className="title">Diro Session Crash Troubleshooting</div>
          <div className="session-input">
            <input value={sessionId} onChange={(e) => setSessionId(e.target.value)} placeholder="Enter Session ID" />
            <button onClick={() => fetchSession(sessionId)} disabled={loading}>{loading ? 'Loading…' : 'Load'}</button>
            {error && <span style={{ color: '#b91c1c', marginLeft: 8 }}>Error: {error}</span>}
          </div>
        </div>

        <Collapsible title="Session Overview" defaultOpen>
          {data && <SessionOverview session={data.session} />}
        </Collapsible>

        <Collapsible title="Alerts (Slack/Sentry/New Relic)" defaultOpen>
          <div className="overview-strip"><div className="kv"><span className="k">Summary:</span><span className="v">No alert integrations in mock mode</span></div></div>
        </Collapsible>

        <Collapsible title="Crash Scenario Hypothesis" defaultOpen>
          <div className="overview-strip"><div className="kv"><span className="k">Hypothesis:</span><span className="v">{hypothesis}</span></div></div>
        </Collapsible>

        <Collapsible title="Unified Timeline" defaultOpen>
          {data && (
            <Filters
              mode="compact"
              componentsData={data.components}
              lastTimestamps={data.lastTimestamps}
              state={filters}
              onChange={setFilters}
            />
          )}
          <Timeline entries={filteredLogs} components={data?.components || []} />
        </Collapsible>
      </main>
    </div>
  );
}
