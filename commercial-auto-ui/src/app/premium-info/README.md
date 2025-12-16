# Premium Info Component

A standalone Angular component that displays commercial auto insurance premium calculations with discounts and fees.

## Overview

**Component**: `PremiumInfo`
**Type**: Standalone Component (Angular 21)
**Export**: Available as a micro front-end module

## Features

- ✅ Displays base premium amount
- ✅ Shows applicable discounts (Safe Driver, Multi-Vehicle, Good Student)
- ✅ Lists administrative fees
- ✅ Calculates total premium (annual and monthly)
- ✅ Responsive design
- ✅ Professional styling with gradient headers

## Usage

### Option 1: As a Micro Front-End (Module Federation)

The component is exposed via Native Federation and can be loaded by the React host application or any other application.

**Exposed as**: `./premium-info`

**Bootstrap file**: `src/bootstrap-premium-info.ts`

**Load in React/JavaScript**:
```javascript
const premiumInfoModule = await import(
  /* webpackIgnore: true */
  'http://localhost:4201/premium-info.js'
);

await premiumInfoModule.mount(containerElement);
```

### Option 2: Direct Component Import

```typescript
import { PremiumInfo } from './app/premium-info';

// Use in your Angular module or standalone component
@Component({
  imports: [PremiumInfo],
  // ...
})
```

## Component Structure

### Files
- `premium-info.ts` - Component TypeScript class
- `premium-info.html` - Template with premium breakdown
- `premium-info.scss` - Styles with responsive design
- `index.ts` - Export barrel file

### Data Model

```typescript
{
  basePremium: 2500,
  discounts: [
    { name: 'Safe Driver', amount: 250 },
    { name: 'Multi-Vehicle', amount: 150 },
    { name: 'Good Student', amount: 100 }
  ],
  fees: [
    { name: 'Administrative Fee', amount: 50 },
    { name: 'Policy Fee', amount: 25 }
  ]
}
```

### Computed Properties

- `totalDiscounts`: Sum of all discounts
- `totalFees`: Sum of all fees
- `finalPremium`: Base premium - discounts + fees

## Styling

The component features:
- Gradient blue header
- Card-based layout with shadow
- Color-coded amounts (green for discounts)
- Responsive breakpoints for mobile devices
- Professional insurance industry design

## Module Federation

This component is exported through the `federation.config.js`:

```javascript
exposes: {
  './commercial-auto-app': './src/bootstrap.ts',
  './premium-info': './src/bootstrap-premium-info.ts',  // ← New export
}
```

## Example: Creating a Standalone HTML Page

You can create a dedicated HTML page to load just this component:

```html
<!-- public/premium-info.html in React host -->
<script type="module">
  const module = await import('http://localhost:4201/premium-info.js');
  const container = document.getElementById('app-container');
  await module.mount(container);
</script>
```

## Development

To test the component in development:

1. Start the Angular application:
   ```bash
   cd commercial-auto-ui
   npm start
   ```

2. The component is available as a Module Federation export at:
   ```
   http://localhost:4201/premium-info.js
   ```

3. Create a standalone HTML page or load it in React host to test

## Customization

To modify premium data, edit the `premiumData` object in `premium-info.ts`:

```typescript
premiumData = {
  basePremium: 2500,  // Change base amount
  discounts: [
    // Add/modify discounts
  ],
  fees: [
    // Add/modify fees
  ]
};
```

## Future Enhancements

Potential improvements:
- [ ] Make premium data dynamic (from API)
- [ ] Add form inputs for user customization
- [ ] Include breakdown animations
- [ ] Add print/download functionality
- [ ] Support multiple payment plan options
- [ ] Include coverage details
