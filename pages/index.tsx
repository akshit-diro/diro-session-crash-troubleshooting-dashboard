import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import SessionOverview from '../components/SessionOverview';
import TitleBar from '../components/TitleBar';
import RightAlertsSidebar from '../components/RightAlertsSidebar';
import UnifiedTimeline from '../components/UnifiedTimeline';
import CrashAnalysis from '../components/CrashAnalysis';
import type { ComponentData, LogEntry, SessionData } from '../lib/types';
import LogSourceLoader, { type LoadStatus, type SessionDocStatus } from '../components/LogSourceLoader';
import { getAvailableLogSourceTypes } from '../lib/fetchers';
import type { LogSourceType } from '../lib/logSources';

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
  const [sessionId, setSessionId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SessionResponse | null>(null);
  const [showAlerts, setShowAlerts] = useState(false);
  const [sourceOrder, setSourceOrder] = useState<LogSourceType[]>([]);
  const [sourceStatus, setSourceStatus] = useState<Record<LogSourceType, LoadStatus>>({} as any);
  const [sessionDocStatus, setSessionDocStatus] = useState<SessionDocStatus>({ status: 'pending' });

  const fetchSession = async (id: string) => {
    setLoading(true); setError(null); setData(null);
    setSessionDocStatus({ status: 'pending' });
    try {
      // 1) Fetch session meta (components, alerts, etc.) - this includes session document fetching
      setSessionDocStatus({ status: 'loading' });
      const metaRes = await fetch(`/api/session-meta?id=${encodeURIComponent(id)}`);
      if (!metaRes.ok) throw new Error(`${metaRes.status}`);
      const meta = await metaRes.json();
      setSessionDocStatus({ status: 'done' });

      // 2) Determine available source types and init loader state
      const types: LogSourceType[] = getAvailableLogSourceTypes(meta.components);
      setSourceOrder(types);
      setSourceStatus(types.reduce((acc: any, t) => { acc[t] = 'pending'; return acc; }, {}));

      // 3) Fetch logs per source type, updating loader progressively
      let allLogs: LogEntry[] = [];
      for (const t of types) {
        setSourceStatus((prev) => ({ ...prev, [t]: 'loading' }));
        try {
          const r = await fetch(`/api/logs/${encodeURIComponent(t)}?session=${encodeURIComponent(id)}`);
          if (!r.ok) throw new Error(`${r.status}`);
          const j = await r.json();
          allLogs = allLogs.concat(j.logs || []);
          
          // If this is graylog and we have TSLogs, include them too
          if (t === 'graylog' && j.TSLogs && Array.isArray(j.TSLogs)) {
            console.log(`Adding ${j.TSLogs.length} TS logs to the timeline`);
            allLogs = allLogs.concat(j.TSLogs);
          }
          
          setSourceStatus((prev) => ({ ...prev, [t]: 'done' }));
        } catch (e) {
          console.error(`Failed to fetch logs for type ${t}:`, e);
          setSourceStatus((prev) => ({ ...prev, [t]: 'error' }));
        }
      }
      allLogs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      const lastTimestamps: Record<string, string> = {};
      for (const e of allLogs) lastTimestamps[e.component] = e.timestamp;

      const merged: SessionResponse = {
        session: meta.session,
        components: meta.components,
        logs: allLogs,
        lastTimestamps,
        hypotheses: meta.hypotheses || [],
        alerts: meta.alerts || [],
        mock: meta.mock,
      };
      setData(merged);
    } catch (e: any) {
      setError(e.message || 'Failed');
      setData(null);
      setSessionDocStatus({ status: 'error' });
    } finally { setLoading(false); }
  };

  useEffect(() => { 
    if (sessionId) {
      fetchSession(sessionId); 
    }
  }, []);

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

        {loading && sourceOrder.length > 0 && (
          <LogSourceLoader order={sourceOrder} status={sourceStatus} sessionDocStatus={sessionDocStatus} />
        )}

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
