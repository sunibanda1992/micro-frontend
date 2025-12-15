# Remotes Directory

This directory contains all micro front-end remote applications that are loaded into the React host.

## Structure

Each remote application should have its own folder with the following structure:

```
remotes/
├── remote-name/
│   ├── RemoteName.tsx        # Main component that loads the remote
│   ├── RemoteName.css        # Styles specific to this remote
│   ├── config.ts             # Configuration (URL, component key, etc.)
│   └── index.ts              # Barrel export file
```

## Adding a New Remote

To add a new remote application:

1. **Create a new folder** under `remotes/` with a descriptive name (e.g., `personal-auto`, `home-insurance`)

2. **Create the main component** (e.g., `PersonalAutoRemote.tsx`):
   ```tsx
   import React, { useEffect, useRef, useState } from 'react';
   import { getImportMapLoader } from '../../utils/importMapLoader';
   import { PersonalAutoConfig } from './config';
   import './PersonalAutoRemote.css';

   const PersonalAutoRemote: React.FC = () => {
     // Implementation similar to CommercialAutoRemote
   };

   export default PersonalAutoRemote;
   ```

3. **Create the config file** (`config.ts`):
   ```typescript
   export const PersonalAutoConfig = {
     remoteUrl: process.env.REACT_APP_PERSONAL_AUTO_URL || 'http://localhost:4202',
     componentKey: './personal-auto-app',
     name: 'personal-auto-ui',
     displayName: 'Personal Auto Insurance',
     description: 'Insurance coverage for personal vehicles',
   };
   ```

4. **Create the styles** (`RemoteName.css`)

5. **Create the index file** (`index.ts`):
   ```typescript
   export { default as PersonalAutoRemote } from './PersonalAutoRemote';
   export { PersonalAutoConfig } from './config';
   ```

6. **Add type declarations** in `src/types/remotes/`:
   ```typescript
   // src/types/remotes/personal-auto.d.ts
   declare module 'http://localhost:4202/personal-auto-app.js' {
     export function mount(container: HTMLElement): Promise<void>;
     export function unmount(): void;
   }
   ```

7. **Update** `src/types/remotes/index.d.ts`:
   ```typescript
   /// <reference path="./personal-auto.d.ts" />
   ```

8. **Import and use in App.tsx**:
   ```tsx
   const PersonalAutoRemote = lazy(() => import('./remotes/personal-auto/PersonalAutoRemote'));
   ```

## Best Practices

- **Naming Convention**: Use kebab-case for folder names, PascalCase for component names
- **Environment Variables**: Always provide a fallback URL in the config
- **Error Handling**: Implement proper error boundaries for each remote
- **Loading States**: Show appropriate loading indicators during initialization
- **Cleanup**: Implement unmount logic to clean up resources when the component unmounts
- **Type Safety**: Always create type declarations for remote modules
- **Documentation**: Document any specific configuration or requirements for each remote

## Current Remotes

### Commercial Auto Insurance
- **Folder**: `commercial-auto/`
- **URL**: http://localhost:4201
- **Component Key**: `./commercial-auto-app`
- **Description**: Commercial vehicle and fleet insurance coverage

## Environment Variables

Each remote can be configured via environment variables:

- `REACT_APP_COMMERCIAL_AUTO_URL` - Commercial Auto UI remote URL

Add new environment variables to `.env` file as needed.
