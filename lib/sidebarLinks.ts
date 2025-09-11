export interface SidebarLinkConfig {
  // Component id from ComponentData.id (e.g., 'gateway', 'booking_engine')
  component: string;
  key: string;
  label: string;
  // Template may include {component} (ComponentData.name) or {id} (ComponentData.id)
  href: string;
}

export const sidebarLinks: SidebarLinkConfig[] = [
  // Infra / networking
  { component: 'loadbalancer', key: 'graylog', label: 'Graylog', href: 'https://graylog.example.com/search?q={component}' },

  // Gateway / core services
  { component: 'gateway', key: 'newrelic', label: 'New Relic', href: 'https://one.newrelic.com/?query={component}' },
  { component: 'gateway', key: 'otel', label: 'OpenTelemetry', href: 'https://otel.example.com/?service={component}' },
  { component: 'gateway', key: 'graylog', label: 'Graylog', href: 'https://graylog.example.com/search?q={component}' },

  // Booking engine
  { component: 'booking_engine', key: 'newrelic', label: 'New Relic', href: 'https://one.newrelic.com/?query={component}' },
  { component: 'booking_engine', key: 'otel', label: 'OpenTelemetry', href: 'https://otel.example.com/?service={component}' },
  { component: 'booking_engine', key: 'graylog', label: 'Graylog', href: 'https://graylog.example.com/search?q={component}' },

  // Web server and remote desktop layers
  { component: 'tomcat', key: 'graylog', label: 'Graylog', href: 'https://graylog.example.com/search?q={component}' },
  { component: 'guacd', key: 'graylog', label: 'Graylog', href: 'https://graylog.example.com/search?q={component}' },
  { component: 'guacamole', key: 'graylog', label: 'Graylog', href: 'https://graylog.example.com/search?q={component}' },

  // Terminal server
  { component: 'terminal_server', key: 'graylog', label: 'Graylog', href: 'https://graylog.example.com/search?q={component}' },

  // Browser / extension / automation / keepalive
  { component: 'extension', key: 'autonav-codes', label: 'Auto-Nav Codes', href: 'https://docs.diro.io/autonav/errors' },
  { component: 'automation', key: 'autonav-codes', label: 'Auto-Nav Codes', href: 'https://docs.diro.io/autonav/errors' },
  { component: 'automation', key: 'graylog', label: 'Graylog', href: 'https://graylog.example.com/search?q={component}' },
  { component: 'keepalive', key: 'graylog', label: 'Graylog', href: 'https://graylog.example.com/search?q={component}' },
];

export function resolveSidebarHref(template: string, c: { id: string; name: string }): string {
  const encodedComponent = encodeURIComponent(c.name);
  // Avoid String.replaceAll for wider TS/JS compatibility
  return template
    .split('{component}').join(encodedComponent)
    .split('{id}').join(encodeURIComponent(c.id));
}
