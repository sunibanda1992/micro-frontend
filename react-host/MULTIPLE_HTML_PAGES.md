# Multiple HTML Pages Setup (No React Routing)

This React host application serves separate HTML pages for each remote micro front-end application using **standalone HTML files** without React routing or complex webpack configurations.

## Architecture

This approach uses **static HTML files** in the `public/` directory that directly load remote micro front-ends using ES modules and import maps. This is simpler and more reliable than using multiple webpack entry points.

Each remote application has:
1. **Standalone HTML file** in `public/` directory with embedded JavaScript
2. **No React dependency** - Pure vanilla JS for loading remotes
3. **Direct module loading** - Uses ES modules and import maps

## Current Setup

### Commercial Auto Application
- **URL**: `http://localhost:3000/commercial-auto.html`
- **File**: [public/commercial-auto.html](public/commercial-auto.html)
- **Type**: Standalone HTML with embedded JavaScript

### Main Host Application (React)
- **URL**: `http://localhost:3000/` or `http://localhost:3000/index.html`
- **File**: [public/index.html](public/index.html)
- **Type**: React application (standard Create React App)

## How It Works

The `commercial-auto.html` file is a **standalone HTML page** that:
1. Includes all necessary CSS styles inline
2. Uses vanilla JavaScript (ES modules) to load the remote
3. Dynamically loads import maps from the remote application
4. Mounts the Angular remote directly into the DOM

**Key advantage**: No webpack compilation needed for this page - it's served directly as a static file from the `public/` folder.

## Adding a New Remote Application

Follow these steps to add a new remote micro front-end:

### Step 1: Copy the Template

Copy `public/commercial-auto.html` as a template:

```bash
cp public/commercial-auto.html public/your-remote-name.html
```

### Step 2: Customize the HTML

Edit the new HTML file and update:

1. **Title and metadata** (lines 11, 19, 154-155):
```html
<title>Your Remote Application</title>
<h1>Your Remote Application</h1>
<p class="subtitle">Micro Front-End Application</p>
```

2. **Configuration** (lines 175-177):
```javascript
// Configuration
const REMOTE_URL = 'http://localhost:YOUR_PORT';  // Your remote's port
const COMPONENT_KEY = './your-component-name';     // The exposed component key
```

3. **Container ID** (line 166):
```html
<div id="your-remote-container"></div>
```

4. **Footer text** (line 171):
```html
<p>&copy; 2025 Your Remote Application</p>
```

### Step 3: Update the Mount Logic (if needed)

If your remote has a different mount signature, update the mounting code around line 309:

```javascript
// Default Angular mount
if (angularModule.mount) {
  await angularModule.mount(containerEl);
}

// OR for a different framework
if (angularModule.bootstrap) {
  await angularModule.bootstrap(containerEl);
}
```

### Step 4: Test Your Setup

1. Start your remote application:
   ```bash
   cd your-remote-app
   npm start
   ```

2. Start the React host (if not already running):
   ```bash
   cd react-host
   npm start
   ```

3. Access your new page:
   ```
   http://localhost:3000/your-remote-name.html
   ```

## Benefits of This Approach

1. **No Webpack Config Needed**: HTML files are served directly from `public/` folder
2. **No Build Time Impact**: Adding new HTML pages doesn't affect webpack compilation
3. **Simple & Reliable**: No complex multi-entry webpack configurations
4. **Framework Agnostic**: Each page can load any framework or vanilla JS
5. **Independent Loading**: Each remote loads completely independently
6. **Direct URLs**: Clean, bookmarkable URLs for each application
7. **Easy Debugging**: View source to see exactly what's loading
8. **No React Router**: Standard browser navigation

## Navigation Between Pages

Use regular HTML navigation:

```html
<!-- In your HTML -->
<nav style="padding: 20px; background: #f5f5f5;">
  <a href="/">Home (React)</a> |
  <a href="/commercial-auto.html">Commercial Auto</a> |
  <a href="/your-remote-name.html">Your Remote</a>
</nav>
```

Or programmatic navigation in JavaScript:

```javascript
// Navigate to another page
window.location.href = '/commercial-auto.html';
```

## Production Build

When building for production:

```bash
cd react-host
npm run build
```

All HTML files from `public/` will be copied to the `build/` directory:
- `build/index.html` (React app with webpack bundles)
- `build/commercial-auto.html` (Standalone, no webpack bundles)
- `build/your-remote-name.html` (Standalone, no webpack bundles)

The standalone HTML files work as-is in production without any additional processing.

## Troubleshooting

### Issue: Page shows blank
- Check browser console for errors
- Verify the remote application is running on the correct port
- Check that the REMOTE_URL in the HTML matches your remote's URL

### Issue: CORS errors
- Ensure both host and remote are on localhost
- Check that remote has CORS headers configured
- Verify remote is actually running and accessible

### Issue: Remote not loading
- Open browser DevTools Network tab
- Check if remoteEntry.json is loading successfully
- Verify the component key matches what the remote exposes
- Check the mount function exists in the loaded module

### Issue: Import map errors
- Check browser console for import map errors
- Verify ES Module Shims is loading (for older browsers)
- Check that all shared dependencies are in the import map

## Example: Multiple Remotes

Here's how your setup might look with multiple remotes:

```
react-host/
├── public/
│   ├── index.html                    → http://localhost:3000/ (React app)
│   ├── commercial-auto.html          → http://localhost:3000/commercial-auto.html (Angular)
│   ├── insurance-quotes.html         → http://localhost:3000/insurance-quotes.html (Vue)
│   ├── claims-portal.html            → http://localhost:3000/claims-portal.html (React)
│   └── favicon.ico
├── src/
│   ├── App.tsx                       (Main React app)
│   ├── index.tsx
│   └── remotes/
│       └── commercial-auto/          (Optional: for React-based loading)
│           └── CommercialAutoRemote.tsx
└── craco.config.js                   (Simple config, no multi-entry)
```

**Each `.html` file in `public/` is independent** and can be accessed directly.

## Comparison: Static HTML vs React Entry Points

### Static HTML Approach (Current - Recommended)
- ✅ Simple - just copy HTML files
- ✅ No webpack configuration
- ✅ No build time impact
- ✅ Works with any framework
- ✅ Easy to debug

### Multiple Entry Points Approach (Not Used)
- ❌ Complex webpack configuration
- ❌ Increases build time significantly
- ❌ Create React App doesn't support well
- ❌ Requires CRACO customization
- ❌ Harder to debug

## Advanced: Adding Navigation Menu

To add a navigation menu to all pages, you can:

1. Create a shared navigation component in `public/shared-nav.js`
2. Include it in each HTML file
3. Or use a server-side template system in production

Example shared navigation:

```javascript
// public/shared-nav.js
export function renderNavigation(activePagecontainerId) {
  const nav = document.createElement('nav');
  nav.style.cssText = 'padding: 10px 20px; background: #1e3a8a; display: flex; gap: 20px;';

  const links = [
    { href: '/', label: 'Home' },
    { href: '/commercial-auto.html', label: 'Commercial Auto' },
    { href: '/insurance-quotes.html', label: 'Quotes' },
  ];

  links.forEach(link => {
    const a = document.createElement('a');
    a.href = link.href;
    a.textContent = link.label;
    a.style.cssText = 'color: white; text-decoration: none;';
    if (window.location.pathname === link.href) {
      a.style.fontWeight = 'bold';
    }
    nav.appendChild(a);
  });

  document.body.insertBefore(nav, document.body.firstChild);
}
```

Then in each HTML file:
```html
<script type="module">
  import { renderNavigation } from './shared-nav.js';
  renderNavigation();
</script>
```
