# React Host - Project Structure

## Overview

This React application serves as the host for multiple micro front-end applications. The codebase is organized to be maintainable, scalable, and easy to extend with new remote applications.

## Directory Structure

```
react-host/
├── public/                          # Static assets
│   └── index.html                   # HTML template (no hardcoded import maps)
│
├── src/
│   ├── remotes/                     # Remote micro front-end applications
│   │   ├── commercial-auto/         # Commercial Auto Insurance remote
│   │   │   ├── CommercialAutoRemote.tsx    # Main component
│   │   │   ├── CommercialAutoRemote.css    # Component styles
│   │   │   ├── config.ts                   # Configuration
│   │   │   └── index.ts                    # Barrel exports
│   │   └── README.md                # Documentation for adding new remotes
│   │
│   ├── types/                       # TypeScript type declarations
│   │   └── remotes/                 # Remote module type declarations
│   │       ├── commercial-auto.d.ts # Commercial Auto types
│   │       └── index.d.ts           # Central type declarations
│   │
│   ├── utils/                       # Utility functions
│   │   └── importMapLoader.ts       # Dynamic import map loader
│   │
│   ├── App.tsx                      # Main application component
│   ├── App.css                      # Main application styles
│   ├── index.tsx                    # Bootstrap entry point
│   └── bootstrap.tsx                # Main React initialization
│
├── craco.config.js                  # CRACO configuration
├── package.json                     # Dependencies and scripts
└── PROJECT_STRUCTURE.md             # This file

```

## Key Components

### Main Application
- **App.tsx**: Main application component that loads remote applications
- **App.css**: Global styles for the host application
- **index.tsx**: Entry point with bootstrap pattern
- **bootstrap.tsx**: Actual React initialization

### Remotes Directory (`src/remotes/`)
Contains all remote micro front-end applications. Each remote has its own folder with:
- Component file (`.tsx`)
- Styles file (`.css`)
- Configuration file (`config.ts`)
- Barrel export file (`index.ts`)

### Types Directory (`src/types/`)
Contains TypeScript type declarations for remote modules. Organized by category:
- **remotes/**: Type declarations for each remote application

### Utils Directory (`src/utils/`)
Contains utility functions and helpers:
- **importMapLoader.ts**: Handles dynamic loading of import maps from remote applications

## Configuration

### Remote Configuration
Each remote has a `config.ts` file that defines:
- `remoteUrl`: URL of the remote application (with env variable fallback)
- `componentKey`: The exposed component key from the remote
- `name`: Internal name of the remote
- `displayName`: User-friendly display name
- `description`: Brief description of the remote

Example:
```typescript
export const CommercialAutoConfig = {
  remoteUrl: process.env.REACT_APP_COMMERCIAL_AUTO_URL || 'http://localhost:4201',
  componentKey: './commercial-auto-app',
  name: 'commercial-auto-ui',
  displayName: 'Commercial Auto Insurance',
  description: 'Comprehensive coverage for commercial vehicles and fleets',
};
```

### Environment Variables
- `REACT_APP_COMMERCIAL_AUTO_URL`: URL for Commercial Auto remote (default: http://localhost:4201)
- Add new variables for additional remotes as needed

## Adding a New Remote

See [src/remotes/README.md](./src/remotes/README.md) for detailed instructions on adding new remote applications.

## Code Organization Principles

### 1. Separation of Concerns
- Each remote is self-contained in its own folder
- Configuration is separated from component logic
- Types are organized in a dedicated directory

### 2. Maintainability
- Clear folder structure makes it easy to locate files
- Consistent naming conventions across remotes
- Documentation at key points (READMEs, comments)

### 3. Scalability
- Easy to add new remotes by following the established pattern
- Centralized utilities (import map loader) reduce duplication
- Type safety ensures reliability as the application grows

### 4. Reusability
- Import map loader is shared across all remotes
- Configuration pattern can be reused for each new remote
- Barrel exports make imports clean and simple

## Import Examples

### Importing a Remote Component
```typescript
// In App.tsx
import { CommercialAutoRemote } from './remotes/commercial-auto';

// Or with lazy loading
const CommercialAutoRemote = lazy(() => import('./remotes/commercial-auto/CommercialAutoRemote'));
```

### Importing a Remote Configuration
```typescript
import { CommercialAutoConfig } from './remotes/commercial-auto/config';
```

### Importing Utilities
```typescript
import { getImportMapLoader } from './utils/importMapLoader';
```

## Build and Development

### Development
```bash
npm start
```
Runs on http://localhost:3000

### Production Build
```bash
npm run build
```
Outputs to `build/` directory

### Type Checking
```bash
npm run build
```
TypeScript will check all types during build

## Best Practices

1. **Always use TypeScript** for type safety
2. **Follow the established folder structure** when adding new remotes
3. **Use environment variables** for configuration that may change between environments
4. **Implement error boundaries** for each remote to prevent cascade failures
5. **Keep remotes independent** - avoid tight coupling between remotes
6. **Document new features** in appropriate README files
7. **Use lazy loading** for remote components to improve initial load time
8. **Handle loading and error states** gracefully in each remote component

## Related Documentation

- [Remotes Documentation](./src/remotes/README.md) - How to add and configure remote applications
- [Developer Guide](../DEVELOPER_GUIDE.md) - Complete setup and troubleshooting guide
- [Adding New Angular Remote](../ADDING_NEW_ANGULAR_REMOTE.md) - Step-by-step guide for Angular remotes

## Version History

### v1.0 - Restructured (2025-12-15)
- Reorganized project structure for better maintainability
- Created dedicated folders for remotes, types, and utilities
- Improved documentation and added structure guides
- Implemented clean separation of concerns

### v0.1 - Initial Setup
- Basic React host application
- Single Angular remote integration
- Hardcoded configuration
