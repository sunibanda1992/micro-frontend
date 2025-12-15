/**
 * Configuration for Commercial Auto Insurance Remote Application
 */

export const CommercialAutoConfig = {
  // Remote application URL - can be overridden by environment variable
  remoteUrl: process.env.REACT_APP_COMMERCIAL_AUTO_URL || 'http://localhost:4201',

  // Component key exposed by the remote
  componentKey: './commercial-auto-app',

  // Remote application name
  name: 'commercial-auto-ui',

  // Display name for the application
  displayName: 'Commercial Auto Insurance',

  // Description
  description: 'Comprehensive coverage for commercial vehicles and fleets',
};
