# Micro Front-End Developer Guide

## React Host + Angular 21 Remote Application

This guide documents the complete setup process, challenges faced, and solutions implemented for creating a micro front-end architecture with React 19 as the host and Angular 21 as a remote application.

> **📘 Additional Resources:**
> Looking to add more Angular micro front-ends? See **[ADDING_NEW_ANGULAR_REMOTE.md](./ADDING_NEW_ANGULAR_REMOTE.md)** for a step-by-step guide.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Prerequisites](#prerequisites)
3. [Project Setup](#project-setup)
4. [Key Challenges & Solutions](#key-challenges--solutions)
5. [Configuration Details](#configuration-details)
6. [Running the Applications](#running-the-applications)
7. [Troubleshooting](#troubleshooting)
8. [Best Practices](#best-practices)

---

## Architecture Overview

### Technology Stack

**React Host Application:**
- React 19
- TypeScript
- CRACO (Create React App Configuration Override)
- Import Maps for module resolution
- ES Module Shims

**Angular Remote Application:**
- Angular 21 (Standalone Components)
- Native Federation (esbuild-based)
- Hash Location Strategy for routing
- Lazy-loaded routes

### Communication Flow

```
┌─────────────────────────────────────────┐
│   React Host (localhost:3000)           │
│   ┌─────────────────────────────────┐   │
│   │  Import Maps Configuration      │   │
│   │  - Maps Angular dependencies    │   │
│   └─────────────────────────────────┘   │
│              ↓                           │
│   ┌─────────────────────────────────┐   │
│   │  Dynamic ES Module Import       │   │
│   │  import('http://localhost:4201  │   │
│   │         /Component.js')         │   │
│   └─────────────────────────────────┘   │
│              ↓                           │
│   ┌─────────────────────────────────┐   │
│   │  Angular App Mounted            │   │
│   │  container.appendChild(appRoot) │   │
│   └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│   Angular Remote (localhost:4201)       │
│   ┌─────────────────────────────────┐   │
│   │  Native Federation              │   │
│   │  - Exposes Component.js         │   │
│   │  - Serves remoteEntry.json      │   │
│   └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

---

## Prerequisites

- **Node.js**: v18 or higher
- **npm**: v10 or higher
- Basic understanding of React and Angular
- Understanding of ES Modules and Import Maps

---

## Project Setup

### Step 1: Create React Host Application

```bash
npx create-react-app react-host --template typescript
cd react-host
```

#### Install Dependencies

```bash
npm install --save-dev @craco/craco
npm install @softarc/native-federation-runtime
```

#### Configure CRACO

Create `craco.config.js`:

```javascript
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.output.publicPath = 'auto';
      return webpackConfig;
    },
  },
  devServer: {
    port: 3000,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
};
```

#### Update package.json Scripts

```json
"scripts": {
  "start": "craco start",
  "build": "craco build",
  "test": "craco test"
}
```

#### Bootstrap Pattern for Module Federation

**Issue:** Module Federation requires proper initialization of shared modules.

**Solution:** Implement bootstrap pattern.

Create `src/bootstrap.tsx` (move content from `src/index.tsx`):

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
```

Update `src/index.tsx`:

```typescript
import('./bootstrap');

export {};
```

---

### Step 2: Create Angular 21 Remote Application

```bash
npx @angular/cli@21 new angular-remote --routing --style=css --skip-git
cd angular-remote
```

#### Install Native Federation

**Important:** Angular 21 uses esbuild (not webpack), so we use Native Federation.

```bash
npm install --save-dev @angular-architects/native-federation
```

#### Initialize Native Federation

```bash
npx ng g @angular-architects/native-federation:init --project angular-remote --port 4201 --type remote
```

This creates:
- `federation.config.js`
- Updates `angular.json`
- Creates `src/bootstrap.ts`

---

## Key Challenges & Solutions

### Challenge 1: Module Federation Compatibility

**Problem:** Angular 21 uses esbuild (not webpack). Traditional webpack Module Federation doesn't work.

**Solution:**
- Angular uses Native Federation (esbuild-based)
- React uses Import Maps to resolve Angular dependencies
- Direct ES module imports instead of webpack federation

**Files Changed:**
- `react-host/public/index.html` - Added Import Maps
- `react-host/src/AngularRemote.tsx` - Dynamic import with webpackIgnore

---

### Challenge 2: Module Resolution Errors

**Problem:**
```
Failed to resolve module specifier "@angular/platform-browser"
```

**Root Cause:** Browser cannot resolve bare module specifiers like `@angular/platform-browser`.

**Solution:** Add Import Maps in React host HTML:

`react-host/public/index.html`:

```html
<script async src="https://ga.jspm.io/npm:es-module-shims@1.8.0/dist/es-module-shims.js"></script>
<script type="importmap">
{
  "imports": {
    "@angular/platform-browser": "http://localhost:4201/_angular_platform_browser.lbkLjXJOKB-dev.js",
    "@angular/core": "http://localhost:4201/_angular_core.paXHURqEbH-dev.js",
    "@angular/core/primitives/signals": "http://localhost:4201/_angular_core_primitives_signals.-4PXKiNbnX-dev.js",
    "@angular/core/primitives/di": "http://localhost:4201/_angular_core_primitives_di.fZWqgCmcOW-dev.js",
    "@angular/common": "http://localhost:4201/_angular_common.NoW7wh_WNF-dev.js",
    "@angular/common/http": "http://localhost:4201/_angular_common_http.WtVag2sTuh-dev.js",
    "@angular/router": "http://localhost:4201/_angular_router.sUYs580DXt-dev.js",
    "rxjs": "http://localhost:4201/rxjs.Uq80WeLYoh-dev.js",
    "rxjs/operators": "http://localhost:4201/rxjs_operators.9ONIVMkLpN-dev.js",
    "tslib": "http://localhost:4201/tslib.4-Mulmcugc-dev.js",
    "@nf-internal/chunk-7NAXH2WG": "http://localhost:4201/chunk-7NAXH2WG.js",
    "@nf-internal/chunk-N3BRAIDT": "http://localhost:4201/chunk-N3BRAIDT.js",
    "@nf-internal/chunk-GGATVS4C": "http://localhost:4201/chunk-GGATVS4C.js",
    "@nf-internal/chunk-5TBCPPGR": "http://localhost:4201/chunk-5TBCPPGR.js",
    "@nf-internal/chunk-WDMUDEB6": "http://localhost:4201/chunk-WDMUDEB6.js"
  }
}
</script>
```

**How to Get These Mappings:**

```bash
# Fetch the remoteEntry.json from Angular dev server
curl http://localhost:4201/remoteEntry.json

# Extract packageName and outFileName
# Map each packageName to http://localhost:4201/{outFileName}
```

---

### Challenge 2.5: Dynamic Import Map Loading

**Problem:** Hardcoded import maps in HTML require manual updates whenever Angular dependencies change.

**Root Cause:** Import maps were statically defined in `index.html`, making them brittle and hard to maintain.

**Solution:** Create a utility to dynamically fetch `remoteEntry.json` and generate import maps at runtime.

`react-host/src/utils/importMapLoader.ts`:

```typescript
export class ImportMapLoader {
  private remoteUrl: string;
  private isLoaded: boolean = false;

  constructor(remoteUrl: string) {
    this.remoteUrl = remoteUrl.replace(/\/$/, '');
  }

  async fetchRemoteEntry(): Promise<RemoteEntry> {
    const remoteEntryUrl = `${this.remoteUrl}/remoteEntry.json`;
    const response = await fetch(remoteEntryUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch remoteEntry.json: ${response.statusText}`);
    }
    return await response.json();
  }

  generateImportMap(remoteEntry: RemoteEntry): ImportMap {
    const imports: Record<string, string> = {};
    remoteEntry.shared.forEach(({ packageName, outFileName }) => {
      imports[packageName] = `${this.remoteUrl}/${outFileName}`;
    });
    return { imports };
  }

  injectImportMap(importMap: ImportMap): void {
    const importMapScript = document.createElement('script');
    importMapScript.type = 'importmap';
    importMapScript.textContent = JSON.stringify(importMap, null, 2);
    const firstScript = document.querySelector('script');
    if (firstScript) {
      firstScript.parentNode?.insertBefore(importMapScript, firstScript);
    } else {
      document.head.appendChild(importMapScript);
    }
  }

  async loadModuleShims(): Promise<void> {
    if ('importmap' in HTMLScriptElement.prototype) {
      return; // Native support
    }
    if (window.esmsInitOptions || document.querySelector('script[src*="es-module-shims"]')) {
      return; // Already loaded
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://ga.jspm.io/npm:es-module-shims@1.8.0/dist/es-module-shims.js';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load ES Module Shims'));
      document.head.appendChild(script);
    });
  }

  async initialize(): Promise<void> {
    if (this.isLoaded) return;

    await this.loadModuleShims();
    const remoteEntry = await this.fetchRemoteEntry();
    const importMap = this.generateImportMap(remoteEntry);
    this.injectImportMap(importMap);
    await new Promise(resolve => setTimeout(resolve, 100)); // Wait for processing

    this.isLoaded = true;
  }

  getExposedComponentUrl(componentKey: string): string {
    return `${this.remoteUrl}/${componentKey.replace('./', '')}.js`;
  }
}
```

**Updated AngularRemote.tsx:**

```typescript
import { getImportMapLoader } from './utils/importMapLoader';

const ANGULAR_REMOTE_URL = process.env.REACT_APP_ANGULAR_REMOTE_URL || 'http://localhost:4201';
const ANGULAR_COMPONENT_KEY = './Component';

const AngularRemote: React.FC = () => {
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const loadAngularApp = async () => {
      try {
        setInitializing(true);

        // Initialize import maps dynamically
        const importMapLoader = getImportMapLoader(ANGULAR_REMOTE_URL);
        await importMapLoader.initialize();

        setInitializing(false);

        // Load the component
        const componentUrl = importMapLoader.getExposedComponentUrl(ANGULAR_COMPONENT_KEY);
        const angularModule = await import(/* webpackIgnore: true */ componentUrl);

        if (containerRef.current && angularModule.mount) {
          await angularModule.mount(containerRef.current);
          setLoaded(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setInitializing(false);
      }
    };
    loadAngularApp();
  }, []);

  return (
    <div>
      {initializing && <div>Initializing import maps...</div>}
      {!initializing && !loaded && !error && <div>Loading Angular application...</div>}
      <div ref={containerRef} id="angular-remote-container"></div>
    </div>
  );
};
```

**Benefits:**
- No hardcoded import maps in HTML
- Automatic updates when Angular dependencies change
- Environment-specific configuration via `REACT_APP_ANGULAR_REMOTE_URL`
- Cleaner separation of concerns
- Better error handling

---

### Challenge 3: Angular Selector Not Found

**Problem:**
```
ERROR: NG05104: The selector "app-root" did not match any elements
```

**Root Cause:** Angular bootstrap looks for `<app-root>` element but React container doesn't have it.

**Solution:** Create `<app-root>` element dynamically in the mount function.

`angular-remote/src/bootstrap.ts`:

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { ApplicationRef } from '@angular/core';

let appRef: ApplicationRef | null = null;

export const mount = async (container: HTMLElement) => {
  if (appRef) {
    return;
  }

  // Create an app-root element in the container
  const appRoot = document.createElement('app-root');
  container.appendChild(appRoot);

  // Bootstrap the application
  appRef = await bootstrapApplication(App, appConfig);
};

export const unmount = () => {
  if (appRef) {
    appRef.destroy();
    appRef = null;
  }
};

// Only bootstrap automatically when running standalone
if (document.querySelector('app-root')) {
  bootstrapApplication(App, appConfig)
    .catch((err) => console.error(err));
}
```

---

### Challenge 4: TypeScript Module Errors

**Problem:**
```
TS2307: Cannot find module 'http://localhost:4201/Component.js'
```

**Solution:** Create type declaration file.

`react-host/src/remote-modules.d.ts`:

```typescript
declare module 'http://localhost:4201/Component.js' {
  export function mount(container: HTMLElement): Promise<void>;
  export function unmount(): void;
}
```

---

### Challenge 5: RUNTIME-006 Error (Invalid loadShareSync)

**Problem:**
```
Invalid loadShareSync function call from runtime #RUNTIME-006
```

**Root Cause:** Module Federation trying to use loadShareSync before initialization.

**Solution:** Bootstrap pattern + eager: false in shared config (already implemented in Step 1).

---

## Configuration Details

### Native Federation Configuration

`angular-remote/federation.config.js`:

```javascript
const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'angular-remote',

  exposes: {
    './Component': './src/bootstrap.ts',  // Expose bootstrap with mount function
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },

  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
  ],

  features: {
    ignoreUnusedDeps: true
  }
});
```

### React Component to Load Angular

`react-host/src/AngularRemote.tsx`:

```typescript
import React, { useEffect, useRef, useState } from 'react';
import { getImportMapLoader } from './utils/importMapLoader';

const ANGULAR_REMOTE_URL = process.env.REACT_APP_ANGULAR_REMOTE_URL || 'http://localhost:4201';
const ANGULAR_COMPONENT_KEY = './Component';

const AngularRemote: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const loadAngularApp = async () => {
      try {
        console.log('Loading Angular remote with dynamic import maps...');
        setInitializing(true);

        // Step 1: Initialize import maps dynamically
        const importMapLoader = getImportMapLoader(ANGULAR_REMOTE_URL);
        await importMapLoader.initialize();

        console.log('Import maps initialized, loading Angular component...');

        // Step 2: Get the component URL
        const componentUrl = importMapLoader.getExposedComponentUrl(ANGULAR_COMPONENT_KEY);
        console.log('Loading component from:', componentUrl);

        setInitializing(false);

        // Step 3: Load the Component.js which now resolves Angular dependencies via import map
        const angularModule = await import(
          /* webpackIgnore: true */
          /* @vite-ignore */
          componentUrl
        );

        console.log('Angular module loaded:', angularModule);

        // Step 4: Mount the Angular application
        if (containerRef.current && angularModule.mount) {
          await angularModule.mount(containerRef.current);
          setLoaded(true);
          console.log('Angular app mounted successfully');
        } else {
          console.error('Mount function not found in module:', angularModule);
          setError('Mount function not found in Angular module');
        }
      } catch (err) {
        console.error('Failed to load Angular remote:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setInitializing(false);
      }
    };

    loadAngularApp();
  }, []);

  return (
    <div>
      <h2>Angular 21 Remote Application</h2>
      {error && (
        <div style={{
          color: 'red',
          padding: '10px',
          background: '#ffebee',
          borderRadius: '5px',
          margin: '10px 0'
        }}>
          Error: {error}
        </div>
      )}
      {initializing && !loaded && !error && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#667eea' }}>
          Initializing import maps...
        </div>
      )}
      {!initializing && !loaded && !error && (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          Loading Angular application...
        </div>
      )}
      <div ref={containerRef} id="angular-remote-container"></div>
    </div>
  );
};

export default AngularRemote;
```

---

## Angular 21 Routing Setup

### Lazy-Loaded Routes with Hash Strategy

**Why Hash Strategy?**
- Prevents conflicts with React's routing
- Works seamlessly in micro front-end environments
- No server configuration needed

`angular-remote/src/app/app.config.ts`:

```typescript
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withHashLocation } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withHashLocation())  // Hash strategy enabled
  ]
};
```

`angular-remote/src/app/app.routes.ts`:

```typescript
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home').then(m => m.Home)  // Lazy loaded
  },
  {
    path: 'about',
    loadComponent: () => import('./about/about').then(m => m.About)  // Lazy loaded
  }
];
```

---

## Running the Applications

### Development Mode

**Terminal 1 - Start Angular Remote:**
```bash
cd angular-remote
npm install
npm start
```
Access: http://localhost:4201

**Terminal 2 - Start React Host:**
```bash
cd react-host
npm install
npm start
```
Access: http://localhost:3000

### Execution Order

⚠️ **IMPORTANT:** Always start Angular remote BEFORE React host!

**Why?**
- React host needs to fetch `remoteEntry.json` from Angular
- Import maps reference Angular's served files
- Without Angular running, module resolution will fail

---

## Troubleshooting

### Issue: "Cannot find module" errors in browser

**Check:**
1. Angular dev server is running on port 4201
2. Import map URLs match Angular's served file names
3. CORS is enabled in both servers

**Solution:**
```bash
# Verify Angular is serving files
curl http://localhost:4201/remoteEntry.json

# Check if Component.js is accessible
curl http://localhost:4201/Component.js
```

---

### Issue: Routes not working in Angular

**Check:**
1. Hash location strategy is configured
2. RouterOutlet is present in template
3. RouterLink and RouterLinkActive are imported

**Solution:**
Verify `app.config.ts` has `withHashLocation()` and component imports routing directives.

---

### Issue: Styles not applying

**Check:**
1. CSS files are properly imported in components
2. View Encapsulation is correct
3. No conflicting global styles

---

### Issue: Hot reload not working

**Solution:**
Restart both applications. Angular's Native Federation dev server sometimes requires full restart.

---

## Best Practices

### 1. Port Configuration

- Use consistent ports (React: 3000, Angular: 4201)
- Document port usage in README
- Configure CORS properly

### 2. Import Maps Management

- Keep import maps in sync with Angular's build output
- Use a script to auto-generate import maps from `remoteEntry.json`
- Version control the import map configuration

### 3. Error Handling

- Always implement error boundaries in React
- Add error handling in Angular bootstrap
- Provide user-friendly error messages

### 4. Performance

- Use lazy loading for routes
- Minimize shared dependencies
- Monitor bundle sizes

### 5. Development Workflow

```bash
# Recommended workflow
1. Start Angular remote first
2. Verify Angular is accessible at localhost:4201
3. Start React host
4. Verify integration at localhost:3000
```

---

## Key Learnings

### Angular 21 Changes

1. **Default Standalone Components**
   - No `standalone: true` flag needed (default in Angular 17+)
   - `imports` array in `@Component` decorator
   - No NgModules required

2. **esbuild Instead of Webpack**
   - Faster builds
   - Different Module Federation approach (Native Federation)
   - Different configuration files

3. **Native Federation**
   - Uses `remoteEntry.json` instead of `remoteEntry.js`
   - Requires import maps for module resolution
   - Works with ES modules natively

### React + Angular Integration

1. **No iframe Needed**
   - Direct DOM integration
   - Shared event bus possible
   - Better performance

2. **Import Maps are Key**
   - Essential for module resolution
   - Maps bare imports to URLs
   - Supported by ES Module Shims polyfill

3. **Bootstrap Pattern**
   - Required for proper initialization
   - Prevents sync/async issues
   - Enables proper mount/unmount

---

## File Structure

```
micro-front-end/
├── react-host/
│   ├── public/
│   │   └── index.html              # HTML template (no hardcoded import maps)
│   ├── src/
│   │   ├── utils/
│   │   │   └── importMapLoader.ts  # Dynamic import map utility
│   │   ├── index.tsx               # Bootstrap entry
│   │   ├── bootstrap.tsx           # Main React app
│   │   ├── AngularRemote.tsx       # Angular loader component
│   │   └── remote-modules.d.ts     # Type declarations
│   ├── craco.config.js             # CRACO configuration
│   └── package.json
│
├── angular-remote/
│   ├── src/
│   │   ├── app/
│   │   │   ├── home/              # Home component (lazy loaded)
│   │   │   ├── about/             # About component (lazy loaded)
│   │   │   ├── app.ts             # Main app component
│   │   │   ├── app.config.ts      # App configuration with hash strategy
│   │   │   └── app.routes.ts      # Route definitions
│   │   ├── bootstrap.ts            # Bootstrap with mount/unmount
│   │   └── main.ts
│   ├── federation.config.js        # Native Federation config
│   ├── angular.json
│   └── package.json
│
├── DEVELOPER_GUIDE.md              # Comprehensive developer documentation
└── README.md
```

---

## Production Considerations

### 1. Build Process

**React Host:**
```bash
npm run build
# Outputs to build/
```

**Angular Remote:**
```bash
npm run build
# Outputs to dist/
```

### 2. Deployment

- Deploy both applications independently
- Update import map URLs to production URLs
- Configure CDN for static assets
- Set up proper CORS headers

### 3. Monitoring

- Track bundle sizes
- Monitor load times
- Implement error tracking (Sentry, etc.)
- Log micro front-end communication

---

## Additional Resources

- [Angular Native Federation](https://www.npmjs.com/package/@angular-architects/native-federation)
- [Import Maps Specification](https://github.com/WICG/import-maps)
- [Module Federation Documentation](https://module-federation.io/)
- [Angular 21 Release Notes](https://blog.angular.dev/)

---

## Summary

This setup demonstrates:
- ✅ React 19 + Angular 21 integration
- ✅ Native Federation with esbuild
- ✅ Import Maps for module resolution
- ✅ Lazy-loaded Angular routes
- ✅ Hash location strategy
- ✅ Standalone components (Angular 21 default)
- ✅ No iframe isolation
- ✅ Direct DOM integration

The key to success is understanding that Angular 21's esbuild-based architecture requires a different approach than traditional webpack Module Federation. Import Maps bridge the gap and enable seamless integration.
