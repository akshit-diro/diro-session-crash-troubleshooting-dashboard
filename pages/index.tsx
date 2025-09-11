import { useEffect, useMemo, useState } from 'react';
import Collapsible from '../components/Collapsible';
import Sidebar from '../components/Sidebar';
import SessionOverview from '../components/SessionOverview';
import TitleBar from '../components/TitleBar';
// import Alerts from '../components/Alerts';
// import CrashHypothesis from '../components/CrashHypothesis';
import UnifiedTimeline from '../components/UnifiedTimeline';
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

  // const hypothesis = useMemo(() => {
  //   if (!data) return '—';
  //   const hasGuacError = data.logs.some((l) => l.component.includes('guacamole') && l.level === 'error');
  //   const tsDisconnect = data.logs.find((l) => l.component.includes('terminal_server') && /disconnect/i.test(l.message));
  //   const keepaliveFail = data.logs.find((l) => l.component.includes('keepalive') && l.level === 'error');
  //   if (hasGuacError && tsDisconnect) return 'Guacamole client error likely triggered TS disconnection.';
  //   if (keepaliveFail) return 'Keep-alive websocket instability observed; may contribute to session drop.';
  //   return 'No obvious crash root-cause; review warnings around disconnect timeframe.';
  // }, [data]);

  return (
    <div className="layout">
      <Sidebar components={data?.components || []} />
      <main className="main">
        <TitleBar
          title="Diro Session Crash Troubleshooting"
          sessionId={sessionId}
          onChange={setSessionId}
          onLoad={() => fetchSession(sessionId)}
          loading={loading}
          error={error}
        />

        <Collapsible title="Session Overview" defaultOpen>
          {data && <SessionOverview session={data.session} />}
        </Collapsible>

        {/* <div className="two-col">
          <Collapsible title="Alerts (Slack/Sentry/New Relic)" defaultOpen>
            <Alerts summary="No alert integrations in mock mode" />
          </Collapsible>

          <Collapsible title="Crash Scenario Hypothesis" defaultOpen>
            <CrashHypothesis hypothesis={hypothesis} />
          </Collapsible>
        </div> */}

        <Collapsible title="Unified Timeline" defaultOpen>
          {data && (
            <UnifiedTimeline
              components={data.components}
              logs={data.logs}
              lastTimestamps={data.lastTimestamps}
            />
          )}
        </Collapsible>
      </main>
    </div>
  );
}
