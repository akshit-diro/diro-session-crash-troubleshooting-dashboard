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
  { component: 'infra_loadbalancer', key: 'newrelic', label: 'New Relic', href: '#new_relic' },

  // Gateway / core services
  { component: 'infra_gateway', key: 'newrelic', label: 'New Relic', href: '#new_relic' },

  // Booking engine
  { component: 'booking_engine', key: 'newrelic', label: 'New Relic', href: '#new_relic' },
  { component: 'booking_engine', key: 'graylogs', label: 'Graylogs', href: 'https://graylog.dirolabs.com:9000' },

  // Web server and remote desktop layers
  { component: 'diro_guac', key: 'newrelic', label: 'New Relic', href: '#new_relic' },
  { component: 'diro_guac', key: 'graylogs', label: 'Graylogs', href: 'https://graylog.dirolabs.com:9000' },

  // Terminal server
  { component: 'terminal_server', key: 'newrelic', label: 'New Relic', href: '#new_relic' },

  // Browser / extension / automation / keepalive
  // { component: 'chrome', key: 'graylogs', label: 'Graylogs', href: 'https://graylog.dirolabs.com:9000' },

  // AutoNav
  { component: 'an_extension', key: 'graylogs', label: 'Graylogs', href: 'https://graylog.dirolabs.com:9000' },
  { component: 'an_extension', key: 'autonav-codes', label: 'Auto-Nav Error Codes', href: 'https://dirolabs.atlassian.net/wiki/spaces/AI/pages/6409650194/AutoNav+Error+Codes' },
  { component: 'an_python', key: 'newrelic', label: 'New Relic', href: '#new_relic' },
  { component: 'an_python', key: 'graylogs', label: 'Graylogs', href: 'https://graylog.dirolabs.com:9000' },
  { component: 'an_python', key: 'autonav-codes', label: 'Auto-Nav Error Codes', href: 'https://dirolabs.atlassian.net/wiki/spaces/AI/pages/6409650194/AutoNav+Error+Codes' },
  { component: 'keepalive', key: 'newrelic', label: 'New Relic', href: '#new_relic' },
  { component: 'keepalive', key: 'graylogs', label: 'Graylogs', href: 'https://graylog.dirolabs.com:9000' },
];

export function resolveSidebarHref(template: string, c: { id: string; name: string }): string {
  const encodedComponent = encodeURIComponent(c.name);
  // Avoid String.replaceAll for wider TS/JS compatibility
  return template
    .split('{component}').join(encodedComponent)
    .split('{id}').join(encodeURIComponent(c.id));
}
