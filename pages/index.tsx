import { useEffect, useMemo, useState } from 'react';
import Collapsible from '../components/Collapsible';
import Sidebar from '../components/Sidebar';
import SessionOverview from '../components/SessionOverview';
import TitleBar from '../components/TitleBar';
import Alerts from '../components/Alerts';
import CrashHypothesis from '../components/CrashHypothesis';
import UnifiedTimeline from '../components/UnifiedTimeline';
import CrashAnalysis from '../components/CrashAnalysis';
import type { ComponentData, LogEntry, SessionData } from '../lib/types';

interface SessionResponse {
  session: SessionData;
  components: ComponentData[];
  logs: LogEntry[];
  lastTimestamps: Record<string, string>;
  hypotheses: any[];
  alerts: any[];
  mock?: boolean;
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
    <div>
      <Sidebar components={data?.components || []} />
      <main className="min-h-screen p-4 grid gap-3" style={{ marginLeft: 'var(--sidebar-w, 260px)' }}>
        <TitleBar
          title="Diro Session Crash Troubleshooting"
          sessionId={sessionId}
          onChange={setSessionId}
          onLoad={() => fetchSession(sessionId)}
          loading={loading}
          error={error}
          isMockData={data?.mock}
        />

        {data && 

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        
          <SessionOverview session={data.session} alerts={data.alerts} />

          {/* <Collapsible title="Crash Scenario Hypotheses" defaultOpen>
            <CrashHypothesis items={(data?.hypotheses || []) as any} />
          </Collapsible> */}

            <div className="col-span-2">
                <CrashAnalysis components={data.components} logs={data.logs} />
            </div>

        </div>}

        {data && (
          <UnifiedTimeline
            components={data.components}
            logs={data.logs}
            lastTimestamps={data.lastTimestamps}
          />
        )}
      </main>
    </div>
  );
}
