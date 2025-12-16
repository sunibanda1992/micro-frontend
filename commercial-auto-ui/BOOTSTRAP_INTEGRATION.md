# Bootstrap Integration - Commercial Auto UI

## Overview

Angular Bootstrap (ng-bootstrap) has been successfully integrated into the commercial-auto-ui application.

## Packages Installed

| Package | Version | Purpose |
|---------|---------|---------|
| `@ng-bootstrap/ng-bootstrap` | 20.0.0 | Angular components for Bootstrap |
| `bootstrap` | Latest | Bootstrap CSS framework |

## Installation Command

```bash
npm install @ng-bootstrap/ng-bootstrap bootstrap
```

## Configuration Changes

### 1. Global Styles (`src/styles.scss`)

Added Bootstrap SCSS import using the modern `@use` syntax:

```scss
/* Import Bootstrap styles */
@use "bootstrap/scss/bootstrap";
```

**Note**: Using `@use` instead of deprecated `@import` for Dart Sass compatibility.

### 2. Application Configuration (`src/app/app.config.ts`)

Updated providers for Angular 21:

```typescript
import { provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withHashLocation()),
    provideClientHydration(withEventReplay())
  ]
};
```

**Changes made**:
- Added `provideZoneChangeDetection` for improved performance
- Added `provideClientHydration` for server-side rendering support
- Removed deprecated `provideAnimations` and `provideAnimationsAsync`

## Usage in Components

### Import ng-bootstrap Components

To use ng-bootstrap components in your standalone components, import them directly:

```typescript
import { Component } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// Or import specific components:
import { NgbDropdownModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [
    NgbDropdownModule,
    NgbModalModule,
    // ... other imports
  ],
  templateUrl: './my-component.html',
  styleUrl: './my-component.scss'
})
export class MyComponent {
  // Component code
}
```

### Available ng-bootstrap Components

- **Accordion**
- **Alert**
- **Carousel**
- **Collapse**
- **Datepicker**
- **Dropdown**
- **Modal**
- **Pagination**
- **Popover**
- **Progressbar**
- **Rating**
- **Timepicker**
- **Toast**
- **Tooltip**
- **Typeahead**

See full documentation: https://ng-bootstrap.github.io/#/components

## Example: Using Bootstrap in Premium Info Component

To enhance the PremiumInfo component with Bootstrap:

```typescript
// src/app/premium-info/premium-info.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-premium-info',
  standalone: true,
  imports: [CommonModule, NgbModule],
  templateUrl: './premium-info.html',
  styleUrl: './premium-info.scss'
})
export class PremiumInfo {
  // ... existing code
}
```

Then use Bootstrap classes in the template:

```html
<!-- src/app/premium-info/premium-info.html -->
<div class="card">
  <div class="card-header bg-primary text-white">
    <h2 class="mb-0">Premium Calculation</h2>
  </div>
  <div class="card-body">
    <div class="list-group">
      <div class="list-group-item d-flex justify-content-between align-items-center">
        <span>Base Premium</span>
        <span class="badge bg-secondary">{{ premiumData.basePremium | currency }}</span>
      </div>
      <!-- More items... -->
    </div>
  </div>
</div>
```

## Bootstrap Classes Available

All Bootstrap CSS classes are now available globally:

### Layout
- Container: `container`, `container-fluid`
- Grid: `row`, `col-*`, `col-sm-*`, `col-md-*`, etc.
- Flexbox: `d-flex`, `justify-content-*`, `align-items-*`

### Components
- Cards: `card`, `card-header`, `card-body`, `card-footer`
- Buttons: `btn`, `btn-primary`, `btn-secondary`, etc.
- Forms: `form-control`, `form-label`, `form-group`
- Badges: `badge`, `bg-*`
- Alerts: `alert`, `alert-*`

### Utilities
- Spacing: `m-*`, `p-*`, `mt-*`, `mb-*`, `mx-*`, `my-*`
- Colors: `text-*`, `bg-*`, `border-*`
- Display: `d-none`, `d-block`, `d-flex`, etc.

See full documentation: https://getbootstrap.com/docs/5.3/

## Build Output

After integration, you'll see Bootstrap styles in the build:

```
Initial chunk files   | Names  |  Raw size
styles.css            | styles | 273.21 kB  ← Bootstrap CSS included
```

## Module Federation Impact

Bootstrap CSS is automatically included in the shared dependencies for both:
- `./commercial-auto-app` export
- `./premium-info` export

The CSS will be loaded once and shared across all components loaded via Module Federation.

## Compatibility

| Technology | Version | Compatible |
|-----------|---------|------------|
| Angular | 21.0.5 | ✅ Yes |
| ng-bootstrap | 20.0.0 | ✅ Yes |
| Bootstrap | 5.3+ | ✅ Yes |
| TypeScript | 4.9.5 | ✅ Yes |

## Development Server

The application is currently running with Bootstrap integrated:

```
Local: http://localhost:4201/
```

Visit the Angular app to see Bootstrap styles applied.

## Example Components

### 1. Using Bootstrap Grid

```html
<div class="container">
  <div class="row">
    <div class="col-md-6">Column 1</div>
    <div class="col-md-6">Column 2</div>
  </div>
</div>
```

### 2. Using Bootstrap Card

```html
<div class="card">
  <div class="card-header">Featured</div>
  <div class="card-body">
    <h5 class="card-title">Special title treatment</h5>
    <p class="card-text">Quick example text.</p>
    <a href="#" class="btn btn-primary">Go somewhere</a>
  </div>
</div>
```

### 3. Using ng-bootstrap Modal

```typescript
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

export class MyComponent {
  constructor(private modalService: NgbModal) {}

  openModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-title' });
  }
}
```

```html
<button class="btn btn-primary" (click)="openModal(content)">
  Open Modal
</button>

<ng-template #content let-modal>
  <div class="modal-header">
    <h4 class="modal-title" id="modal-title">Modal title</h4>
    <button type="button" class="btn-close" (click)="modal.dismiss()"></button>
  </div>
  <div class="modal-body">
    <p>Modal body content</p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-secondary" (click)="modal.close()">Close</button>
  </div>
</ng-template>
```

## Troubleshooting

### Issue: Bootstrap styles not showing
- Clear browser cache (Ctrl+Shift+R)
- Check browser console for CSS loading errors
- Verify `styles.css` is loaded in Network tab

### Issue: ng-bootstrap components not working
- Ensure component is imported in `imports` array
- Check that animations provider is configured
- Verify Angular version compatibility

### Issue: Sass deprecation warnings
- These are just warnings, not errors
- The modern `@use` syntax is already in use
- Warnings will be resolved in future Sass versions

## Next Steps

You can now:
1. Use Bootstrap classes in all components
2. Import and use ng-bootstrap components
3. Build responsive layouts with Bootstrap grid
4. Use Bootstrap utilities for spacing, colors, etc.

## Documentation Links

- **ng-bootstrap**: https://ng-bootstrap.github.io/
- **Bootstrap 5**: https://getbootstrap.com/docs/5.3/
- **Bootstrap Icons**: https://icons.getbootstrap.com/

---

**Status**: ✅ Installed and Configured
**Bootstrap Version**: 5.3+
**ng-bootstrap Version**: 20.0.0
**Angular Version**: 21.0.5
**Last Updated**: 2025-12-15
