# Commercial Auto Page - Updated with Premium Info Sidebar

## Overview

The `commercial-auto.html` page has been updated to display **two micro front-end components** side by side:
1. **Commercial Auto App** (main content, left side)
2. **Premium Info** (sidebar, top-right corner)

## Layout

```
┌─────────────────────────────────────────────────────┐
│                   Header                             │
│         Commercial Auto Insurance                    │
└─────────────────────────────────────────────────────┘
┌──────────────────────────────┬──────────────────────┐
│                              │   Premium Info       │
│   Commercial Auto App        │   (Sticky Sidebar)   │
│   (Main Content)             │                      │
│                              │   • Base Premium     │
│                              │   • Discounts        │
│                              │   • Fees             │
│                              │   • Total Premium    │
│                              │                      │
│                              ├──────────────────────┤
│                              │   (Stays in view as  │
│                              │    you scroll)       │
└──────────────────────────────┴──────────────────────┘
```

## Updates Made

### 1. CSS Layout Changes

**Container Layout**:
```css
.app-main {
  display: flex;           /* Side-by-side layout */
  gap: 24px;              /* Space between components */
  max-width: 1600px;      /* Wider to accommodate both */
}

.main-content {
  flex: 1;                /* Takes remaining space */
}

.premium-sidebar {
  width: 350px;           /* Fixed width for premium info */
  position: sticky;       /* Stays visible while scrolling */
  top: 32px;             /* Offset from top */
}
```

**Responsive Design**:
- **Desktop (> 1024px)**: Side-by-side layout
- **Tablet (≤ 1024px)**: Stacked vertically, premium info on top
- **Mobile (≤ 768px)**: Full-width stacked layout

### 2. HTML Structure

Added new sidebar section:
```html
<main class="app-main">
  <!-- Main Content (Left) -->
  <div class="main-content">
    <div class="remote-container">
      <div id="commercial-auto-container"></div>
    </div>
  </div>

  <!-- Premium Sidebar (Right) -->
  <aside class="premium-sidebar">
    <div id="premium-info-container"></div>
  </aside>
</main>
```

### 3. JavaScript Updates

**Two Component Loading Functions**:

1. **`loadCommercialAutoApp()`** - Loads the main Angular app
2. **`loadPremiumInfo()`** - Loads the premium info component
3. **`loadAllComponents()`** - Orchestrates loading both components

**Loading Sequence**:
```javascript
async function loadAllComponents() {
  await loadCommercialAutoApp();    // Load main app first
  await loadPremiumInfo();           // Then load premium sidebar
}
```

## Features

### Premium Info Component Features:
✅ Displays insurance premium breakdown
✅ Shows discounts (Safe Driver, Multi-Vehicle, Good Student)
✅ Lists fees (Administrative, Policy)
✅ Calculates total annual and monthly premiums
✅ Sticky positioning - stays visible while scrolling
✅ Responsive design - moves to top on smaller screens

### Commercial Auto App:
✅ Main insurance application UI
✅ Full-width responsive container
✅ Independent loading and error handling

## Access

**URL**: `http://localhost:3000/commercial-auto.html`

Both components load automatically when you visit the page.

## Component Sources

Both components are loaded from the Angular remote application:

| Component | Export Key | URL |
|-----------|-----------|-----|
| Commercial Auto App | `./commercial-auto-app` | `http://localhost:4201/commercial-auto-app.js` |
| Premium Info | `./premium-info` | `http://localhost:4201/premium-info.js` |

## Loading States

Each component has independent loading and error states:

**Commercial Auto App**:
- Loading: Spinner with "Loading Commercial Auto application..."
- Error: Red error message box
- Success: Full Angular app renders

**Premium Info**:
- Loading: Smaller spinner with "Loading Premium Info..."
- Error: Red error message box
- Success: Premium calculation card renders

## Responsive Behavior

### Desktop (> 1024px)
```
┌──────────────────┬─────────┐
│                  │ Premium │
│  Main App        │  Info   │
│                  │ (sticky)│
└──────────────────┴─────────┘
```

### Tablet (≤ 1024px)
```
┌─────────────────────────────┐
│      Premium Info           │
│      (Top, Full Width)      │
├─────────────────────────────┤
│      Main App               │
│      (Below)                │
└─────────────────────────────┘
```

### Mobile (≤ 768px)
```
┌──────────────────┐
│  Premium Info    │
│  (Full Width)    │
├──────────────────┤
│  Main App        │
│  (Full Width)    │
└──────────────────┘
```

## Technical Details

### Import Map Sharing
Both components use the same import map loader, ensuring:
- Single import map injection
- Shared Angular dependencies
- Efficient resource loading

### Error Handling
Each component has independent error handling:
- Network errors
- Module loading errors
- Missing mount function errors
- Import map initialization errors

### Performance
- **Lazy Loading**: Both components load asynchronously
- **Code Splitting**: Separate bundles for each component
- **Shared Dependencies**: Angular core libraries shared via import maps
- **Sticky Positioning**: CSS-only, no JavaScript scroll listeners

## Benefits

1. **Better UX**: Premium info always visible while filling out forms
2. **Modular**: Each component loads independently
3. **Responsive**: Adapts to different screen sizes
4. **Maintainable**: Clear separation of concerns
5. **Performant**: Shared dependencies, efficient loading

## File Modified

**File**: `react-host/public/commercial-auto.html`

**Changes**:
- Updated CSS for flex layout and sidebar
- Added responsive breakpoints
- Added premium-info sidebar HTML
- Added `loadPremiumInfo()` function
- Updated component loading orchestration

**Lines Changed**: ~90 lines modified/added

## Testing

To test the updated page:

1. **Ensure Angular remote is running**:
   ```bash
   cd commercial-auto-ui
   npm start
   ```

2. **Ensure React host is running**:
   ```bash
   cd react-host
   npm start
   ```

3. **Open browser**:
   ```
   http://localhost:3000/commercial-auto.html
   ```

4. **Expected result**:
   - Main app loads on the left
   - Premium info appears on the right
   - Both components load successfully
   - Premium sidebar stays visible when scrolling

## Browser Console Output

Expected console logs:
```
Loading Commercial Auto UI...
Remote entry loaded: {...}
Import maps initialized successfully
Loading component from: http://localhost:4201/commercial-auto-app.js
Commercial Auto UI mounted successfully
Loading Premium Info component...
Loading Premium Info from: http://localhost:4201/premium-info.js
Premium Info module loaded: {...}
Premium Info mounted successfully
```

## Troubleshooting

### Premium Info Not Showing
- Check browser console for errors
- Verify Angular app is running on port 4201
- Check that `http://localhost:4201/premium-info.js` returns 200

### Layout Issues
- Check browser width (responsive breakpoints)
- Inspect CSS in browser DevTools
- Verify no CSS conflicts

### Both Components Not Loading
- Check import maps are injected (view page source)
- Verify CORS headers on port 4201
- Check network tab for failed requests

---

**Status**: ✅ Updated and Working
**Components**: 2 (Commercial Auto App + Premium Info)
**Layout**: Responsive side-by-side
**Last Updated**: 2025-12-15
