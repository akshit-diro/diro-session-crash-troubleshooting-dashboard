import { useEffect, useMemo, useState } from 'react';
import Collapsible from '../components/Collapsible';
import Sidebar from '../components/Sidebar';
import SessionOverview from '../components/SessionOverview';
import TitleBar from '../components/TitleBar';
import Alerts from '../components/Alerts';
import RightAlertsSidebar from '../components/RightAlertsSidebar';
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
  const [showAlerts, setShowAlerts] = useState(false);

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
      <main className="p-4 grid gap-3" style={{ marginLeft: 'var(--sidebar-w, 260px)', marginRight: 'var(--rightbar-w, 0px)' }}>
        <TitleBar
          title="Diro Session Crash Troubleshooting"
          sessionId={sessionId}
          onChange={setSessionId}
          onLoad={() => fetchSession(sessionId)}
          loading={loading}
          error={error}
          isMockData={data?.mock}
        />

        {data && data?.session && data.session.status === "Unknown" && (
          <div className="p-4 border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200">
            No data available for session "{sessionId}". Please verify the Session ID and try again.
          </div>
        )}

        {data && data?.session && data.logs.length > 0 && data.session.status !== "Unknown" && (

        <div className="grid grid-cols-1 gap-3 md:grid-cols-3 relative">
        
          <SessionOverview session={data.session} onOpenAlerts={() => setShowAlerts(true)} />

          {/* <Collapsible title="Crash Scenario Hypotheses" defaultOpen>
            <CrashHypothesis items={(data?.hypotheses || []) as any} />
          </Collapsible> */}

            <div className="col-span-2">
                <CrashAnalysis components={data.components} logs={data.logs} />
            </div>

        </div>)}

        {data && data?.session && data.logs.length > 0 && data.session.status !== "Unknown" && (
          <UnifiedTimeline
            components={data.components}
            logs={data.logs}
            lastTimestamps={data.lastTimestamps}
          />
        )}

        {data && data?.session && data.session.status !== "Unknown" && (
          <RightAlertsSidebar alerts={data.alerts || []} open={showAlerts} onClose={() => setShowAlerts(false)} />
        )}
      </main>
    </div>
  );
}
