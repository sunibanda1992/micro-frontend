/**
 * Configuration Service
 * Fetches remote application URLs from a backend API based on region/environment
 */

export interface RemoteConfig {
  name: string;
  url: string;
  componentKey: string;
  region: string;
  version?: string;
}

export interface AppConfig {
  remotes: {
    commercialAuto: RemoteConfig;
    // Add other remotes here
  };
  region: string;
  environment: string;
}

class ConfigService {
  private config: AppConfig | null = null;
  private configUrl: string;

  constructor() {
    // Configuration API URL - can be different per environment
    this.configUrl = process.env.REACT_APP_CONFIG_API_URL || '/api/config';
  }

  /**
   * Fetch configuration from backend API
   * The backend determines the correct URLs based on:
   * - User's geographic location
   * - Environment (dev, staging, production)
   * - Feature flags
   * - A/B testing groups
   */
  async fetchConfig(): Promise<AppConfig> {
    if (this.config) {
      return this.config;
    }

    try {
      const response = await fetch(this.configUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch config: ${response.statusText}`);
      }

      const fetchedConfig: AppConfig = await response.json();
      this.config = fetchedConfig;
      console.log('Configuration loaded:', this.config);

      return fetchedConfig;
    } catch (error) {
      console.error('Failed to load configuration:', error);

      // Fallback to default configuration
      const defaultConfig = this.getDefaultConfig();
      this.config = defaultConfig;
      return defaultConfig;
    }
  }

  /**
   * Get default/fallback configuration
   * Used when API is unavailable or for local development
   */
  private getDefaultConfig(): AppConfig {
    return {
      region: 'us-east-1',
      environment: process.env.NODE_ENV || 'development',
      remotes: {
        commercialAuto: {
          name: 'commercial-auto-ui',
          url: process.env.REACT_APP_COMMERCIAL_AUTO_URL || 'http://localhost:4201',
          componentKey: './commercial-auto-app',
          region: 'us-east-1',
        },
      },
    };
  }

  /**
   * Get configuration for a specific remote
   */
  async getRemoteConfig(remoteName: keyof AppConfig['remotes']): Promise<RemoteConfig> {
    const config = await this.fetchConfig();
    return config.remotes[remoteName];
  }

  /**
   * Detect user's region (can be enhanced with geolocation API)
   */
  async detectRegion(): Promise<string> {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return data.continent_code || 'US';
    } catch (error) {
      console.error('Failed to detect region:', error);
      return 'US';
    }
  }

  /**
   * Clear cached configuration (useful for testing)
   */
  clearCache(): void {
    this.config = null;
  }
}

export const configService = new ConfigService();
