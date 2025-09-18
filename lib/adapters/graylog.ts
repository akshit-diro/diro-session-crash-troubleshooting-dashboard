import type { LogEntry } from '../types';

function isDebug() {
  return process.env.DEBUG_GRAYLOG === '1' || process.env.DEBUG_GRAYLOG === '2';
}

function dbg(...args: any[]) {
  if (isDebug()) {
    // eslint-disable-next-line no-console
    console.log('[graylog]', ...args);
  }
}

export interface GraylogConfig {
  baseUrl: string; // e.g., https://graylog.example.com:9000
  authHeader: string; // Precomputed Authorization header value
  streams?: string[]; // Optional list of stream IDs to filter
  rangeMinutes: number; // Relative search window in minutes
  limit: number; // Max messages to fetch
  queryPrefix?: string; // Additional query terms, e.g. "source:app-*"
}

export function configFromEnv(): GraylogConfig | null {
  const baseUrl = process.env.GRAYLOG_BASE_URL;
  if (!baseUrl) return null;

  const token = process.env.GRAYLOG_TOKEN;
  const username = process.env.GRAYLOG_USERNAME;
  const password = process.env.GRAYLOG_PASSWORD;

  let authHeader = '';
  if (token && token.length > 0) {
    // Common Graylog token usage is Basic base64("token:token")
    const basic = Buffer.from(`${token}:token`).toString('base64');
    authHeader = `Basic ${basic}`;
  } else if (username && password) {
    const basic = Buffer.from(`${username}:${password}`).toString('base64');
    authHeader = `Basic ${basic}`;
  } else {
    return null;
  }

  const streams = (process.env.GRAYLOG_STREAMS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  // If GRAYLOG_RANGE_MINUTES is not set or is 0, use 0 to indicate all-time search
  const rangeMinutes = process.env.GRAYLOG_RANGE_MINUTES ? parseInt(process.env.GRAYLOG_RANGE_MINUTES, 10) : 0;
  // If GRAYLOG_LIMIT is not set or is 0, use 0 to indicate no limit (fetch all data)
  const limit = process.env.GRAYLOG_LIMIT ? parseInt(process.env.GRAYLOG_LIMIT, 10) : 0;
  const queryPrefix = process.env.GRAYLOG_QUERY_PREFIX || undefined;

  const cfg: GraylogConfig = { baseUrl, authHeader, streams: streams.length ? streams : undefined, rangeMinutes, limit, queryPrefix };

  if (isDebug()) {
      dbg('config', {
        baseUrl,
        auth: token ? 'token' : 'basic',
        streams: cfg.streams?.length ? `${cfg.streams.length} stream(s)` : 'none',
        rangeMinutes: rangeMinutes > 0 ? `${rangeMinutes} minutes` : 'all-time',
        limit: limit > 0 ? `${limit} messages` : 'no-limit (all data)',
        queryPrefix: queryPrefix || '(none)'
      });
  }

  return cfg;
}

function buildQuery(sessionId: string, prefix?: string, streams?: string[]): string {
  // Basic query looks for the session id anywhere in the message or fields
  // Users can provide additional prefix such as "source:app-*" or "component:api"
  const parts: string[] = [];
  if (prefix && prefix.trim().length > 0) parts.push(prefix.trim());
  // If multiple streams are provided, include them in the query (Graylog supports streams:ID in queries)
  if (streams && streams.length > 1) {
    const or = streams.map((s) => `streams:${s}`).join(' OR ');
    parts.push(`(${or})`);
  }
  parts.push(sessionId);
  return parts.join(' ');
}

function mapLevel(level: unknown): 'info' | 'warning' | 'error' {
  let n = 6; // Default to info level
  if (typeof level === 'number') {
    n = level;
  } else if (typeof level === 'string') {
    n = parseInt(level, 10);
  }
  
  if (!isFinite(n)) return 'info';
  // Syslog levels: 0 emerg,1 alert,2 crit,3 err,4 warn,5 notice,6 info,7 debug
  if (n <= 3) return 'error';
  if (n === 4) return 'warning';
  return 'info';
}

// Map component names from Graylog to internal component IDs
function mapComponentName(component: string): string {
  const comp = component.toLowerCase().trim();
  
  // Define mapping rules
  const mappingRules = [
    { condition: (c: string) => (c.includes('auto-nav') && c.includes('chrome')) || (c.includes('autonav') && c.includes('extension')) || (c.includes('chrome') && c.includes('extension')), result: 'an_extension' },
    { condition: (c: string) => c.includes('booking') && c.includes('engine'), result: 'booking_engine' },
    { condition: (c: string) => c.includes('terminal') && c.includes('server'), result: 'terminal_server' },
    { condition: (c: string) => c.includes('keepalive') || c.includes('keep-alive'), result: 'keepalive' },
    { condition: (c: string) => c.includes('python') && c.includes('autonav'), result: 'an_python' },
    { condition: (c: string) => c.includes('loadbalancer') || c.includes('load-balancer'), result: 'infra_loadbalancer' },
    { condition: (c: string) => c.includes('gateway') || c.includes('express'), result: 'infra_gateway' },
    { condition: (c: string) => c.includes('chrome') && !c.includes('extension'), result: 'chrome' },
  ];
  
  // Check guacamole components separately due to sub-components
  if (comp.includes('guacamole') || comp.includes('guac')) {
    if (comp.includes('tomcat')) return 'diro_guac_tomcat';
    if (comp.includes('guacd')) return 'diro_guacd';
    return 'diro_guac';
  }
  
  // Apply mapping rules
  for (const rule of mappingRules) {
    if (rule.condition(comp)) {
      return rule.result;
    }
  }
  
  // If no mapping found, create a safe component ID from the original name
  const safeId = comp.replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_').replace(/(?:^_)|(?:_$)/g, '');
  return safeId || 'unknown';
}

// Generate appropriate log source ID based on component
function generateLogSourceId(componentId: string): string {
  const sourceMap: Record<string, string> = {
    'an_extension': '041-an_extenstion-graylogs',
    'an_python': '042-an_python-graylogs', 
    'keepalive': '051-keepalive_python-graylogs',
    'diro_guac': '033-diro_guac-graylogs',
    'booking_engine': '011-bookingengine-graylogs',
    'diro_guac_tomcat': '031-diro_guac_tomcat-graylogs',
    'diro_guacd': '032-diro_guacd-graylogs',
    'terminal_server': '061-TS_eventlogs-graylogs',
    'chrome': '071-chrome-graylogs',
    'infra_loadbalancer': '001-infra_loadbalancer-graylogs',
    'infra_gateway': '002-infra_gateway-graylogs',
  };
  
  return sourceMap[componentId] || `${componentId}-graylogs`;
}

async function performGraylogRequest(url: string, headers: Record<string, string>): Promise<any> {
  const t0 = Date.now();
  try {
    const res = await fetch(url, { headers });
    const status = (res as any).status || 0;
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Graylog HTTP ${status}: ${text || res.statusText}`);
    }
    const body = await res.json();
    
    if (isDebug()) {
      const tookMs = Date.now() - t0;
      const count = Array.isArray(body?.messages) ? body.messages.length : 0;
      dbg('response ok', { status, count, ms: tookMs });
      if (count > 0) {
        const sample = body.messages[0]?.message || body.messages[0] || {};
        dbg('sample message', {
          timestamp: sample?.timestamp || sample?.['@timestamp'],
          source: sample?.source,
          level: sample?.level,
          short: (sample?.message || sample?.short_message || '').slice(0, 160)
        });
      }
    }
    return body;
  } catch (e: any) {
    const hint = process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0' ? '' : ' (set NODE_TLS_REJECT_UNAUTHORIZED=0 for self-signed certs)';
    if (isDebug()) {
      // eslint-disable-next-line no-console
      console.error('[graylog] request failed', { message: e?.message || String(e) });
    }
    throw new Error(`Graylog request failed${hint}: ${e?.message || e}`);
  }
}

function processGraylogMessage(wrapper: any, sessionId: string): LogEntry {
  const m = wrapper?.message || wrapper || {};
  const id: string = m._id || m.id || `${m.timestamp || ''}-${m.source || ''}-${Math.random().toString(36).slice(2)}`;
  const ts: string = m.timestamp || m['@timestamp'] || new Date().toISOString();
  const originalComponent: string = m.component || m.source || 'graylog';
  const mappedComponent = mapComponentName(originalComponent);
  const logSource = generateLogSourceId(mappedComponent);
  const msg: string = m.full_message || m.message || m.short_message || '';
  const lvl = mapLevel(m.level);

  // Include ALL fields from the actual log message only (not wrapper metadata)
  // Filter out gl2* and streams fields
  const filteredMessage = Object.keys(m).reduce((acc: Record<string, any>, key: string) => {
    // Skip fields starting with 'gl2' and the 'streams' field
    if (!key.startsWith('gl2') && key !== 'streams') {
      acc[key] = m[key];
    }
    return acc;
  }, {});

  const detailsObj: Record<string, any> = {
    // Add our tracking fields
    session_id: sessionId,
    original_component: originalComponent,
    
    // Include filtered fields from the original log message (m) - this contains the actual log data
    ...filteredMessage
  };

  return {
    id: String(id),
    timestamp: new Date(ts).toISOString(),
    component: mappedComponent,
    logSource: logSource,
    level: lvl,
    message: String(msg),
    details: JSON.stringify(detailsObj, null, 2), // Pretty print for better readability
  };
}

export async function fetchGraylogLogs(sessionId: string, cfg?: GraylogConfig | null): Promise<LogEntry[]> {
  const conf = cfg ?? configFromEnv();
  if (!conf) throw new Error('Graylog not configured (missing GRAYLOG_* env vars)');
  
  const rangeDescription = conf.rangeMinutes === 0 ? 'ALL-TIME' : `${conf.rangeMinutes} minutes`;
  const limitDescription = conf.limit === 0 ? 'NO-LIMIT' : `${conf.limit} messages`;
  console.log(`fetchGraylogLogs for session ${sessionId} - Range: ${rangeDescription}, Limit: ${limitDescription}`);

  const query = buildQuery(sessionId, conf.queryPrefix, conf.streams);
  const params = new URLSearchParams();
  params.set('query', query);
  
  // Only set limit if it's greater than 0, otherwise fetch all data
  if (conf.limit > 0) {
    params.set('limit', String(conf.limit));
  }
  
  params.set('sort', 'timestamp:asc');
  
  // If exactly one stream provided, use filter param for efficiency
  if (conf.streams && conf.streams.length === 1) {
    params.set('filter', `streams:${conf.streams[0]}`);
  }
  
  // Choose endpoint based on range configuration
  let endpoint: string;
  if (conf.rangeMinutes > 0) {
    // Use relative search with time range
    params.set('range', String(conf.rangeMinutes));
    endpoint = '/api/search/universal/relative';
  } else {
    // Use relative search with a very large range for all-time search
    // This is more reliable than absolute search which requires specific from/to dates
    params.set('range', String(365 * 24 * 60)); // 1 year in minutes (525,600 minutes)
    endpoint = '/api/search/universal/relative';
  }
  
  const url = `${conf.baseUrl.replace(/\/$/, '')}${endpoint}?${params.toString()}`;
  const headers: Record<string, string> = {
    Accept: 'application/json',
    Authorization: conf.authHeader,
    'X-Requested-By': 'diro-session-troubleshooting',
  };

  if (isDebug()) {
    const previewHeaders = { ...headers };
    if (previewHeaders.Authorization) previewHeaders.Authorization = '(redacted)';
    dbg('request', { 
      url, 
      endpoint: conf.rangeMinutes > 0 ? 'relative (time-ranged)' : 'relative (all-time: 1 year)',
      limit: conf.limit > 0 ? `${conf.limit} messages` : 'no-limit (all data)',
      params: Object.fromEntries(params.entries()), 
      headers: previewHeaders 
    });
    dbg('query parts', { sessionId, queryPrefix: conf.queryPrefix || '(none)', streams: conf.streams || [] });
  }

  const body = await performGraylogRequest(url, headers);
  const messages: any[] = Array.isArray(body?.messages) ? body.messages : [];
  const out: LogEntry[] = messages.map(wrapper => processGraylogMessage(wrapper, sessionId));

  if (isDebug()) {
    dbg('mapped entries', { count: out.length });
    if (out.length > 0) {
      const firstEntry = out[0];
      const detailsObj = JSON.parse(firstEntry.details);
      const fieldCount = Object.keys(detailsObj).length;
      dbg('sample entry fields (log data only)', { 
        totalFields: fieldCount,
        availableFields: Object.keys(detailsObj).slice(0, 10), // Show first 10 fields
        hasMoreFields: fieldCount > 10
      });
    }
  }

  return out;
}

// Fetch TS logs from Graylog with time-based query
export async function fetchTSLogsFromGraylog(startTime: string): Promise<LogEntry[]> {
  const conf = configFromEnv();
  if (!conf) {
    console.warn('Graylog not configured for TS logs, returning empty array');
    return [];
  }

  try {
    // Calculate time range: startTime - 10min to startTime + 40min
    const startDate = new Date(startTime);
    const fromTime = new Date(startDate.getTime() - 10 * 60 * 1000); // -10 minutes
    const toTime = new Date(startDate.getTime() + 40 * 60 * 1000);   // +40 minutes
    
    // Debug logging to verify time calculations
    console.log(`TS Logs Time Calculation:`);
    console.log(`  Input startTime: ${startTime}`);
    console.log(`  Parsed startDate: ${startDate.toISOString()}`);
    console.log(`  From Time (-10 min): ${fromTime.toISOString()}`);
    console.log(`  To Time (+40 min): ${toTime.toISOString()}`);
    console.log(`  Total Range: ${(toTime.getTime() - fromTime.getTime()) / (60 * 1000)} minutes`);
    
    const query = 'WINTS-2019-STAGE1';
    const params = new URLSearchParams();
    params.set('query', query);
    params.set('from', fromTime.toISOString());
    params.set('to', toTime.toISOString());
    
    // Only set limit if it's greater than 0, otherwise fetch all data
    if (conf.limit > 0) {
      params.set('limit', String(conf.limit));
    }
    
    params.set('sort', 'timestamp:asc');
    
    // Use absolute search with specific time range
    const url = `${conf.baseUrl.replace(/\/$/, '')}/api/search/universal/absolute?${params.toString()}`;
    const headers: Record<string, string> = {
      Accept: 'application/json',
      Authorization: conf.authHeader,
      'X-Requested-By': 'diro-session-troubleshooting',
    };

    console.log(`Fetching TS logs from ${fromTime.toISOString()} to ${toTime.toISOString()}`);
    
    if (isDebug()) {
      const previewHeaders = { ...headers };
      if (previewHeaders.Authorization) previewHeaders.Authorization = '(redacted)';
      dbg('TS logs request', { 
        url, 
        query,
        timeRange: `${fromTime.toISOString()} to ${toTime.toISOString()}`,
        params: Object.fromEntries(params.entries()), 
        headers: previewHeaders 
      });
    }

    const body = await performGraylogRequest(url, headers);
    const messages: any[] = Array.isArray(body?.messages) ? body.messages : [];
    
    // Process TS logs with ALL data preserved
    const out: LogEntry[] = messages.map(wrapper => {
      const m = wrapper?.message || wrapper || {};
      const id: string = m._id || m.id || `ts-${m.timestamp || ''}-${Math.random().toString(36).slice(2)}`;
      const ts: string = m.timestamp || m['@timestamp'] || new Date().toISOString();
      const msg: string = m.full_message || m.message || m.short_message || '';
      const lvl = mapLevel(m.level);

      // Include ALL fields from the actual TS log message only (not wrapper metadata)
      const detailsObj: Record<string, any> = {
        // Add TS-specific tracking
        ts_query: query,
        original_component: m.component || m.source || 'terminal_server',
        
        // Include ALL fields from the original log message (m) - this contains the actual log data
        ...m
      };

      return {
        id: String(id),
        timestamp: new Date(ts).toISOString(),
        component: 'terminal_server',
        logSource: '061-TS_eventlogs-graylogs',
        level: lvl,
        message: String(msg),
        details: JSON.stringify(detailsObj, null, 2), // Pretty print for better readability
      };
    });

    if (isDebug()) {
      dbg('TS logs mapped entries', { count: out.length });
      if (out.length > 0) {
        const firstEntry = out[0];
        const detailsObj = JSON.parse(firstEntry.details);
        const fieldCount = Object.keys(detailsObj).length;
        dbg('TS logs sample entry fields (log data only)', { 
          totalFields: fieldCount,
          availableFields: Object.keys(detailsObj).slice(0, 10), // Show first 10 fields
          hasMoreFields: fieldCount > 10
        });
      }
    }

    console.log(`Fetched ${out.length} TS log entries from Graylog`);
    return out;
    
  } catch (error) {
    console.error('Failed to fetch TS logs from Graylog:', error);
    return [];
  }
}
