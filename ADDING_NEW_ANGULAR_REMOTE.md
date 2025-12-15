# Adding Another Angular Micro Front-End Application

## Step-by-Step Guide to Host a New Angular Remote Application

This guide walks you through the process of adding a second (or third, fourth, etc.) Angular micro front-end application to your existing React host setup.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Step 1: Create New Angular Application](#step-1-create-new-angular-application)
3. [Step 2: Install Native Federation](#step-2-install-native-federation)
4. [Step 3: Configure Native Federation](#step-3-configure-native-federation)
5. [Step 4: Create Bootstrap File](#step-4-create-bootstrap-file)
6. [Step 5: Update Angular Configuration](#step-5-update-angular-configuration)
7. [Step 6: Create React Component for New Remote](#step-6-create-react-component-for-new-remote)
8. [Step 7: Update React Host](#step-7-update-react-host)
9. [Step 8: Configure Port and Environment](#step-8-configure-port-and-environment)
10. [Step 9: Test the Integration](#step-9-test-the-integration)
11. [Troubleshooting](#troubleshooting)
12. [Example: Adding angular-dashboard Remote](#example-adding-angular-dashboard-remote)

---

## Prerequisites

- Existing React host application (already set up)
- Existing `angular-remote` application (as reference)
- Node.js v18 or higher
- npm v10 or higher
- Understanding of the current micro front-end setup

---

## Step 1: Create New Angular Application

### 1.1 Navigate to Project Root

```bash
cd c:\Users\tejas\SuneendraBanda\micro-front-end
```

### 1.2 Create New Angular Application

```bash
# Replace 'angular-dashboard' with your desired application name
npx @angular/cli@21 new angular-dashboard --routing --style=css --ssr=false --standalone
```

**Important Options:**
- `--routing`: Enables Angular Router
- `--style=css`: Use CSS for styling (or scss, sass, less)
- `--ssr=false`: Disable Server-Side Rendering
- `--standalone`: Use standalone components (default in Angular 21)

### 1.3 Navigate to New Application

```bash
cd angular-dashboard
```

---

## Step 2: Install Native Federation

### 2.1 Install Required Dependencies

```bash
npm install @angular-architects/native-federation --save-dev
```

### 2.2 Initialize Native Federation

```bash
npx ng g @angular-architects/native-federation:init --project angular-dashboard --port 4202 --type remote
```

**Parameters:**
- `--project`: Your application name
- `--port`: Unique port number (e.g., 4202, 4203, etc.)
- `--type remote`: Specifies this is a remote application

---

## Step 3: Configure Native Federation

### 3.1 Create `federation.config.js`

If not created automatically, create `federation.config.js` in the root of your new Angular application:

```javascript
const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'angular-dashboard',

  exposes: {
    './Component': './src/bootstrap.ts',  // Expose bootstrap with mount/unmount functions
  },

  shared: {
    ...shareAll({
      singleton: true,
      strictVersion: true,
      requiredVersion: 'auto'
    }),
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

**Key Configuration:**
- `name`: Unique identifier for this remote (use your app name)
- `exposes`: Maps `./Component` to your bootstrap file
- `shared`: Shares all dependencies as singletons
- `skip`: Excludes unnecessary RxJS modules

---

## Step 4: Create Bootstrap File

### 4.1 Update `src/main.ts`

Rename or update `src/main.ts` to only bootstrap when running standalone:

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Only bootstrap automatically when running standalone
if (document.querySelector('app-root')) {
  bootstrapApplication(App, appConfig).catch((err) => console.error(err));
}
```

### 4.2 Create `src/bootstrap.ts`

Create a new file `src/bootstrap.ts` with mount/unmount functions:

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { ApplicationRef } from '@angular/core';

let appRef: ApplicationRef | null = null;

/**
 * Mount function - Called by React host to initialize Angular app
 * @param container - HTML element where Angular app should be mounted
 */
export const mount = async (container: HTMLElement) => {
  if (appRef) {
    console.warn('Angular app already mounted');
    return;
  }

  // Create an app-root element in the container
  const appRoot = document.createElement('app-root');
  container.appendChild(appRoot);

  // Bootstrap the application
  appRef = await bootstrapApplication(App, appConfig);
  console.log('Angular app mounted successfully');
};

/**
 * Unmount function - Called by React host to destroy Angular app
 */
export const unmount = () => {
  if (appRef) {
    appRef.destroy();
    appRef = null;
    console.log('Angular app unmounted');
  }
};

// Only bootstrap automatically when running standalone
if (document.querySelector('app-root')) {
  bootstrapApplication(App, appConfig).catch((err) => console.error(err));
}
```

---

## Step 5: Update Angular Configuration

### 5.1 Update `angular.json`

Ensure your `angular.json` has the correct configuration. The Native Federation schematic should have updated it automatically. Verify:

```json
{
  "projects": {
    "angular-dashboard": {
      "architect": {
        "build": {
          "builder": "@angular-architects/native-federation:build",
          "options": {
            "target": "angular-dashboard:build:development",
            "rebuildDelay": 0,
            "dev": true,
            "federationConfig": "federation.config.js"
          }
        },
        "serve": {
          "builder": "@angular-architects/native-federation:build",
          "options": {
            "target": "angular-dashboard:serve:development",
            "rebuildDelay": 0,
            "dev": true,
            "port": 4202,
            "federationConfig": "federation.config.js"
          }
        }
      }
    }
  }
}
```

### 5.2 Update `package.json` Scripts

Verify or add these scripts to `package.json`:

```json
{
  "scripts": {
    "start": "ng serve",
    "build": "ng build",
    "test": "ng test"
  }
}
```

---

## Step 6: Create React Component for New Remote

### 6.1 Create Component File

In your React host, create a new component for this remote:

**File:** `react-host/src/AngularDashboard.tsx`

```typescript
import React, { useEffect, useRef, useState } from 'react';
import { getImportMapLoader } from './utils/importMapLoader';

// Configuration for the Angular dashboard remote
const ANGULAR_DASHBOARD_URL = process.env.REACT_APP_ANGULAR_DASHBOARD_URL || 'http://localhost:4202';
const ANGULAR_COMPONENT_KEY = './Component';

const AngularDashboard: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const loadAngularApp = async () => {
      try {
        console.log('Loading Angular dashboard with dynamic import maps...');
        setInitializing(true);

        // Step 1: Initialize import maps dynamically
        const importMapLoader = getImportMapLoader(ANGULAR_DASHBOARD_URL);
        await importMapLoader.initialize();

        console.log('Import maps initialized, loading Angular dashboard component...');

        // Step 2: Get the component URL
        const componentUrl = importMapLoader.getExposedComponentUrl(ANGULAR_COMPONENT_KEY);
        console.log('Loading component from:', componentUrl);

        setInitializing(false);

        // Step 3: Load the Component.js
        const angularModule = await import(
          /* webpackIgnore: true */
          /* @vite-ignore */
          componentUrl
        );

        console.log('Angular dashboard module loaded:', angularModule);

        // Step 4: Mount the Angular application
        if (containerRef.current && angularModule.mount) {
          await angularModule.mount(containerRef.current);
          setLoaded(true);
          console.log('Angular dashboard mounted successfully');
        } else {
          console.error('Mount function not found in module:', angularModule);
          setError('Mount function not found in Angular module');
        }
      } catch (err) {
        console.error('Failed to load Angular dashboard:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setInitializing(false);
      }
    };

    loadAngularApp();

    // Cleanup on unmount
    return () => {
      // Optional: Call unmount if you want to destroy the Angular app when React component unmounts
      // This requires importing the unmount function dynamically
    };
  }, []);

  return (
    <div>
      <h2>Angular Dashboard Application</h2>
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
          Loading Angular dashboard...
        </div>
      )}
      <div ref={containerRef} id="angular-dashboard-container"></div>
    </div>
  );
};

export default AngularDashboard;
```

### 6.2 Update Import Map Loader (Important!)

**CRITICAL:** The current `importMapLoader.ts` uses a singleton pattern. You need to update it to support multiple remotes.

**File:** `react-host/src/utils/importMapLoader.ts`

Update the singleton section:

```typescript
// Map to store multiple import map loaders
const importMapLoaders: Map<string, ImportMapLoader> = new Map();

/**
 * Get or create the import map loader instance for a specific remote
 */
export function getImportMapLoader(remoteUrl: string = 'http://localhost:4201'): ImportMapLoader {
  if (!importMapLoaders.has(remoteUrl)) {
    importMapLoaders.set(remoteUrl, new ImportMapLoader(remoteUrl));
  }
  return importMapLoaders.get(remoteUrl)!;
}
```

### 6.3 Create Type Declarations

**File:** `react-host/src/remote-modules.d.ts`

Add type declarations for the new remote:

```typescript
// Existing declaration for angular-remote
declare module 'http://localhost:4201/Component.js' {
  export function mount(container: HTMLElement): Promise<void>;
  export function unmount(): void;
}

// New declaration for angular-dashboard
declare module 'http://localhost:4202/Component.js' {
  export function mount(container: HTMLElement): Promise<void>;
  export function unmount(): void;
}
```

---

## Step 7: Update React Host

### 7.1 Add Route or Component

Update your React application to include the new Angular dashboard.

**Option 1: Add as a Route (with React Router)**

**File:** `react-host/src/App.tsx`

```typescript
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AngularRemote from './AngularRemote';
import AngularDashboard from './AngularDashboard';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>React Host Application</h1>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/angular-app">Angular App</Link>
            <Link to="/dashboard">Dashboard</Link>
          </nav>
        </header>

        <Routes>
          <Route path="/" element={<div>Welcome to the React Host</div>} />
          <Route path="/angular-app" element={<AngularRemote />} />
          <Route path="/dashboard" element={<AngularDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
```

**Option 2: Add Side by Side**

```typescript
import React from 'react';
import AngularRemote from './AngularRemote';
import AngularDashboard from './AngularDashboard';
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>React Host with Multiple Angular Remotes</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          <AngularRemote />
        </div>
        <div>
          <AngularDashboard />
        </div>
      </div>
    </div>
  );
}

export default App;
```

### 7.2 Install React Router (if using Option 1)

```bash
cd react-host
npm install react-router-dom
```

---

## Step 8: Configure Port and Environment

### 8.1 Update `.env` (Optional)

Create or update `react-host/.env`:

```env
REACT_APP_ANGULAR_REMOTE_URL=http://localhost:4201
REACT_APP_ANGULAR_DASHBOARD_URL=http://localhost:4202
```

### 8.2 Verify Ports

Ensure each application runs on a unique port:

- **React Host**: `http://localhost:3000`
- **Angular Remote**: `http://localhost:4201`
- **Angular Dashboard**: `http://localhost:4202`

---

## Step 9: Test the Integration

### 9.1 Start All Applications

**Terminal 1: Start Angular Remote (existing)**
```bash
cd angular-remote
npm start
```

**Terminal 2: Start Angular Dashboard (new)**
```bash
cd angular-dashboard
npm start
```

**Terminal 3: Start React Host**
```bash
cd react-host
npm start
```

### 9.2 Verify in Browser

1. Open `http://localhost:3000`
2. Navigate to the dashboard route or view side-by-side
3. Check browser console for any errors
4. Verify both Angular apps load correctly

### 9.3 Check Import Maps

Open browser DevTools → Elements → Inspect `<head>` section:

You should see dynamically injected import map scripts for both remotes with their respective dependencies.

---

## Troubleshooting

### Issue 1: Port Already in Use

**Error:** `Port 4202 is already in use`

**Solution:**
```bash
# Find and kill the process using the port (Windows)
netstat -ano | findstr :4202
taskkill /PID <PID> /F

# Or use a different port in angular.json and environment variables
```

### Issue 2: Import Map Conflicts

**Error:** `Failed to resolve module specifier`

**Solution:**
- Each remote should have unique dependency file names (handled automatically by Native Federation)
- Check `remoteEntry.json` of each remote to verify unique hashes in file names
- The updated `importMapLoader` with Map storage should prevent conflicts

### Issue 3: Mount Function Not Found

**Error:** `Mount function not found in Angular module`

**Solution:**
- Verify `bootstrap.ts` exports `mount` and `unmount` functions
- Check `federation.config.js` exposes `./bootstrap.ts` as `./Component`
- Ensure the component is being loaded from the correct URL

### Issue 4: CORS Errors

**Error:** `Access to fetch at 'http://localhost:4202/remoteEntry.json' has been blocked by CORS`

**Solution:**
- Ensure Angular dev server is running with correct CORS headers (should be automatic)
- Verify the URL in your React component matches the actual Angular server URL

### Issue 5: Multiple Instances of Shared Dependencies

**Warning:** Multiple versions of Angular Core loaded

**Solution:**
- Ensure `shared` configuration in `federation.config.js` has `singleton: true`
- All Angular remotes should use compatible versions of Angular and shared dependencies

---

## Example: Adding angular-dashboard Remote

Here's a complete real-world example:

### Directory Structure After Adding New Remote

```
micro-front-end/
├── react-host/
│   ├── src/
│   │   ├── AngularRemote.tsx           # First remote
│   │   ├── AngularDashboard.tsx        # Second remote (NEW)
│   │   ├── utils/
│   │   │   └── importMapLoader.ts      # Updated with Map storage
│   │   ├── remote-modules.d.ts         # Updated with new declarations
│   │   └── App.tsx                     # Updated with routing
│   └── .env                            # Environment variables
│
├── angular-remote/                      # First Angular app (port 4201)
│   ├── src/
│   │   ├── bootstrap.ts
│   │   └── app/
│   └── federation.config.js
│
└── angular-dashboard/                   # Second Angular app (port 4202) (NEW)
    ├── src/
    │   ├── bootstrap.ts
    │   └── app/
    └── federation.config.js
```

### Quick Checklist

- [ ] Created new Angular application
- [ ] Installed Native Federation packages
- [ ] Created `federation.config.js` with unique name and port
- [ ] Created `bootstrap.ts` with mount/unmount functions
- [ ] Updated `angular.json` for Native Federation
- [ ] Created React component for new remote
- [ ] Updated `importMapLoader.ts` to use Map for multiple remotes
- [ ] Added type declarations in `remote-modules.d.ts`
- [ ] Updated React App.tsx with routing or layout
- [ ] Configured unique port number
- [ ] Added environment variables (optional)
- [ ] Tested all applications running together
- [ ] Verified import maps are loaded dynamically
- [ ] Checked for console errors

---

## Best Practices

1. **Use Unique Ports**: Always assign unique ports to each remote (4201, 4202, 4203, etc.)

2. **Consistent Angular Versions**: Use the same Angular version across all remotes to avoid conflicts

3. **Environment Variables**: Use environment variables for remote URLs to support different environments

4. **Error Handling**: Implement proper error boundaries in React components

5. **Loading States**: Provide clear loading and error states to users

6. **Lazy Loading**: Use lazy loading within Angular apps to reduce initial bundle size

7. **Shared Dependencies**: Ensure all remotes share common dependencies (Angular, RxJS, etc.)

8. **Development Mode**: Run all applications in development mode during testing

9. **Production Builds**: Test production builds before deployment

10. **Documentation**: Document each remote's purpose and integration points

---

## Summary

You've successfully learned how to add additional Angular micro front-end applications to your React host! The key steps are:

1. Create new Angular app with Native Federation
2. Configure federation to expose components
3. Create bootstrap with mount/unmount functions
4. Create React component to load the remote
5. Update import map loader to support multiple remotes
6. Test the integration

Each additional Angular remote follows the same pattern, making it easy to scale your micro front-end architecture.

---

## Additional Resources

- [Angular Native Federation Documentation](https://www.angulararchitects.io/en/aktuelles/the-microfrontend-revolution-part-2-module-federation-with-angular/)
- [Import Maps Specification](https://github.com/WICG/import-maps)
- [Micro Front-End Best Practices](https://martinfowler.com/articles/micro-frontends.html)
- [Main Developer Guide](./DEVELOPER_GUIDE.md)

---

**Created:** 2025-12-15
**Last Updated:** 2025-12-15
**Version:** 1.0
