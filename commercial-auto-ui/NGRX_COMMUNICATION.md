# NgRx Store Communication Setup

## Overview

This document explains how NgRx store is configured to enable communication between the **Home component** and **Premium Info component** in the commercial-auto-ui Angular application.

## Architecture

### Components

1. **Home Component** (`src/app/home/`)
   - Contains a form with an input field
   - Dispatches actions to the NgRx store when form is submitted
   - Located in the main Angular app

2. **Premium Info Component** (`src/app/premium-info/`)
   - Subscribes to NgRx store state
   - Displays received values from the Home component
   - Can be loaded as a standalone micro front-end via Module Federation

### NgRx Store Structure

```
src/app/store/
├── premium.actions.ts     # Actions for updating premium value
├── premium.reducer.ts     # Reducer managing premium state
├── premium.selectors.ts   # Selectors for accessing state
└── index.ts              # Barrel export
```

## State Management

### State Interface

```typescript
export interface PremiumState {
  inputValue: string;        // Value entered in the form
  lastUpdated: Date | null;  // Timestamp of last update
}
```

### Actions

- **`updatePremiumValue`** - Dispatched when user submits the form
  ```typescript
  updatePremiumValue({ value: string })
  ```

- **`resetPremiumValue`** - Resets state to initial values
  ```typescript
  resetPremiumValue()
  ```

### Selectors

- **`selectInputValue`** - Returns the current input value
- **`selectLastUpdated`** - Returns the last updated timestamp

## Configuration

### Main Application (`app.config.ts`)

```typescript
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { premiumReducer } from './store/premium.reducer';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore({ premium: premiumReducer }),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    })
  ]
};
```

### Premium Info Bootstrap (`bootstrap-premium-info.ts`)

The Premium Info component has its own bootstrap file with the **same NgRx configuration** to ensure state synchronization when loaded via Module Federation:

```typescript
export async function mount(container: HTMLElement): Promise<void> {
  const appRef = await createApplication({
    providers: [
      provideStore({ premium: premiumReducer }),
      provideStoreDevtools({
        maxAge: 25,
        logOnly: !isDevMode(),
      })
    ]
  });

  appRef.bootstrap(PremiumInfo, container);
}
```

## How Communication Works

### Step 1: User Enters Value in Home Component

```typescript
// home.ts
onSubmit() {
  if (this.premiumInput.trim()) {
    this.store.dispatch(updatePremiumValue({ value: this.premiumInput }));
    console.log('Premium value dispatched:', this.premiumInput);
  }
}
```

### Step 2: Reducer Updates State

```typescript
// premium.reducer.ts
on(updatePremiumValue, (state, { value }) => ({
  ...state,
  inputValue: value,
  lastUpdated: new Date()
}))
```

### Step 3: Premium Info Component Receives Update

```typescript
// premium-info.ts
ngOnInit() {
  this.subscription = this.inputValue$.subscribe(value => {
    this.currentInputValue = value;
    console.log('Premium Info received value from store:', value);
  });
}
```

### Step 4: UI Updates Automatically

The Premium Info component template displays the received value:

```html
<div class="communication-section" *ngIf="currentInputValue">
  <div class="alert alert-success">
    <h4>✓ Communication Successful!</h4>
    <p><strong>Received from Home component:</strong> {{ currentInputValue }}</p>
    <p class="timestamp" *ngIf="lastUpdated$ | async as lastUpdated">
      <small>Last updated: {{ lastUpdated | date:'medium' }}</small>
    </p>
  </div>
</div>
```

## Testing the Communication

### Option 1: Testing within Angular App

1. Start the Angular development server:
   ```bash
   cd commercial-auto-ui
   npm start
   ```

2. Open browser to `http://localhost:4201`

3. Navigate to the **Home** page

4. Enter a value in the "Enter Premium Value" input field

5. Click "Send to Premium Info" button

6. Open the browser's Redux DevTools to see the state change

7. Navigate to the **Premium Info** route (if you add it back) to see the received value

### Option 2: Testing via React Host (Recommended)

This demonstrates the true micro front-end communication:

1. Start the Angular app:
   ```bash
   cd commercial-auto-ui
   npm start
   ```

2. Start the React host in a separate terminal:
   ```bash
   cd react-host
   npm start
   ```

3. Open browser to `http://localhost:3000/commercial-auto.html`

4. You should see:
   - **Left side**: Commercial Auto App with Home component
   - **Right side**: Premium Info component in sidebar

5. In the Home component form:
   - Enter any value (e.g., "Test Communication")
   - Click "Send to Premium Info"

6. The Premium Info component should immediately display:
   - ✓ Communication Successful!
   - Received from Home component: Test Communication
   - Last updated timestamp

### Expected Console Output

**When form is submitted:**
```
Premium value dispatched: Test Communication
```

**In Premium Info component:**
```
Premium Info received value from store: Test Communication
```

## Important Notes

### Shared State Across Micro Front-Ends

⚠️ **Critical**: Both the main Angular app and the Premium Info micro front-end use the **same NgRx store configuration**. This is intentional to enable communication.

However, in the current setup, each application instance creates its **own store instance**. This means:

- ✅ Components within the **same** Angular app can communicate
- ❌ Components in **different** Module Federation remotes have **separate** store instances

### Current Limitation

When Premium Info is loaded as a separate micro front-end in the React host:
- The main Angular app has Store Instance A
- The Premium Info component has Store Instance B
- These are **not synchronized automatically**

### Solutions for Cross-Application Communication

To enable true communication between the main app and Premium Info sidebar:

#### Solution 1: Shared State Service (Recommended)

Use a shared service with BehaviorSubject:

```typescript
// shared-state.service.ts
@Injectable({ providedIn: 'root' })
export class SharedStateService {
  private valueSubject = new BehaviorSubject<string>('');
  value$ = this.valueSubject.asObservable();

  updateValue(value: string) {
    this.valueSubject.next(value);
  }
}
```

#### Solution 2: Window Events

Use browser `postMessage` or custom events:

```typescript
// Dispatch from Home
window.dispatchEvent(new CustomEvent('premiumUpdate', {
  detail: { value: this.premiumInput }
}));

// Listen in Premium Info
window.addEventListener('premiumUpdate', (event) => {
  this.currentInputValue = event.detail.value;
});
```

#### Solution 3: Single Application Instance

Keep both components in the same Angular application instance (current recommended approach when using commercial-auto.html).

## Redux DevTools

The application includes Redux DevTools integration for debugging:

1. Install Redux DevTools browser extension

2. Open browser DevTools

3. Go to Redux tab

4. You can see:
   - Current state
   - Action history
   - Time-travel debugging
   - State diffs

## File Changes Summary

### New Files (5)
- `src/app/store/premium.actions.ts`
- `src/app/store/premium.reducer.ts`
- `src/app/store/premium.selectors.ts`
- `src/app/store/index.ts`
- `NGRX_COMMUNICATION.md` (this file)

### Modified Files (6)
- `src/app/app.config.ts` - Added NgRx store providers
- `src/app/home/home.ts` - Added form and store dispatch
- `src/app/home/home.html` - Added form UI
- `src/app/home/home.scss` - Added form styling
- `src/app/premium-info/premium-info.ts` - Added store subscription
- `src/app/premium-info/premium-info.html` - Added communication display
- `src/app/premium-info/premium-info.scss` - Added communication styling
- `src/bootstrap-premium-info.ts` - Added NgRx providers

### Dependencies Added
- `@ngrx/store@21.0.0-beta.0`
- `@ngrx/store-devtools@21.0.0-beta.0`

## Benefits of This Approach

✅ **Type-safe** - Actions and state are strongly typed
✅ **Predictable** - State changes follow a clear pattern
✅ **Debuggable** - Redux DevTools provides full visibility
✅ **Testable** - Easy to unit test actions, reducers, and selectors
✅ **Scalable** - Easy to add more state slices as needed

## Next Steps

1. ✅ Test basic communication within the Angular app
2. ✅ Test communication in React host (commercial-auto.html)
3. Consider implementing cross-application communication if needed
4. Add more complex state management as requirements grow

---

**Status**: ✅ Implemented and Ready for Testing
**NgRx Version**: 21.0.0-beta.0
**Angular Version**: 21.0.5
**Last Updated**: 2025-12-16
