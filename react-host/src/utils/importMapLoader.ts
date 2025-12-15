/**
 * Utility to dynamically load and inject import maps from Angular remote's remoteEntry.json
 */

// Extend Window interface for ES Module Shims
declare global {
  interface Window {
    esmsInitOptions?: any;
  }
}

interface RemoteEntry {
  name: string;
  shared: Array<{
    packageName: string;
    outFileName: string;
  }>;
  exposes: Array<{
    key: string;
    outFileName: string;
  }>;
}

interface ImportMap {
  imports: Record<string, string>;
}

export class ImportMapLoader {
  private remoteUrl: string;
  private isLoaded: boolean = false;

  constructor(remoteUrl: string) {
    this.remoteUrl = remoteUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  /**
   * Fetch remoteEntry.json from the Angular remote
   */
  async fetchRemoteEntry(): Promise<RemoteEntry> {
    const remoteEntryUrl = `${this.remoteUrl}/remoteEntry.json`;

    try {
      const response = await fetch(remoteEntryUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch remoteEntry.json: ${response.statusText}`);
      }

      const remoteEntry: RemoteEntry = await response.json();
      console.log('Remote entry loaded:', remoteEntry);
      return remoteEntry;
    } catch (error) {
      console.error('Error fetching remoteEntry.json:', error);
      throw error;
    }
  }

  /**
   * Generate import map from remoteEntry
   */
  generateImportMap(remoteEntry: RemoteEntry): ImportMap {
    const imports: Record<string, string> = {};

    // Map all shared dependencies
    remoteEntry.shared.forEach(({ packageName, outFileName }) => {
      imports[packageName] = `${this.remoteUrl}/${outFileName}`;
    });

    console.log('Generated import map:', imports);
    return { imports };
  }

  /**
   * Inject import map into the document
   */
  injectImportMap(importMap: ImportMap): void {
    // Check if import map already exists
    const existingImportMap = document.querySelector('script[type="importmap"]');
    if (existingImportMap) {
      console.warn('Import map already exists, skipping injection');
      return;
    }

    // Create and inject import map script
    const importMapScript = document.createElement('script');
    importMapScript.type = 'importmap';
    importMapScript.textContent = JSON.stringify(importMap, null, 2);

    // Insert before any other scripts
    const firstScript = document.querySelector('script');
    if (firstScript) {
      firstScript.parentNode?.insertBefore(importMapScript, firstScript);
    } else {
      document.head.appendChild(importMapScript);
    }

    console.log('Import map injected successfully');
  }

  /**
   * Load ES Module Shims if needed
   */
  async loadModuleShims(): Promise<void> {
    // Check if import maps are natively supported
    if ('importmap' in HTMLScriptElement.prototype) {
      console.log('Import maps natively supported');
      return;
    }

    // Check if es-module-shims is already loaded
    if (window.esmsInitOptions || document.querySelector('script[src*="es-module-shims"]')) {
      console.log('ES Module Shims already loaded');
      return;
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://ga.jspm.io/npm:es-module-shims@1.8.0/dist/es-module-shims.js';

      script.onload = () => {
        console.log('ES Module Shims loaded');
        resolve();
      };

      script.onerror = () => {
        reject(new Error('Failed to load ES Module Shims'));
      };

      document.head.appendChild(script);
    });
  }

  /**
   * Initialize import maps - main entry point
   */
  async initialize(): Promise<void> {
    if (this.isLoaded) {
      console.log('Import maps already initialized');
      return;
    }

    try {
      // Step 1: Load ES Module Shims if needed
      await this.loadModuleShims();

      // Step 2: Fetch remote entry
      const remoteEntry = await this.fetchRemoteEntry();

      // Step 3: Generate import map
      const importMap = this.generateImportMap(remoteEntry);

      // Step 4: Inject import map
      this.injectImportMap(importMap);

      // Step 5: Wait a bit for import map to be processed
      await new Promise(resolve => setTimeout(resolve, 100));

      this.isLoaded = true;
      console.log('Import maps initialized successfully');
    } catch (error) {
      console.error('Failed to initialize import maps:', error);
      throw error;
    }
  }

  /**
   * Get the URL for an exposed component
   */
  getExposedComponentUrl(componentKey: string): string {
    return `${this.remoteUrl}/${componentKey.replace('./', '')}.js`;
  }
}

// Singleton instance
let importMapLoaderInstance: ImportMapLoader | null = null;

/**
 * Get or create the import map loader instance
 */
export function getImportMapLoader(remoteUrl: string = 'http://localhost:4201'): ImportMapLoader {
  if (!importMapLoaderInstance) {
    importMapLoaderInstance = new ImportMapLoader(remoteUrl);
  }
  return importMapLoaderInstance;
}
