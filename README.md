# Micro Front-End Application

This project demonstrates a micro front-end architecture with a React host application and an Angular 21 remote application using Native Federation and Import Maps.

## Architecture

- **React Host** (`react-host/`): Main application built with React 19, uses Import Maps for module resolution
- **Angular Remote** (`angular-remote/`): Micro front-end built with Angular 21 and Native Federation (esbuild)

## Key Features

- ✅ React 19 as the host application
- ✅ Angular 21 as a remote micro front-end with standalone components
- ✅ Native Federation (esbuild-based) for Angular
- ✅ Import Maps for module resolution
- ✅ Lazy-loaded Angular routes with hash location strategy
- ✅ Direct DOM integration (no iframe)
- ✅ ES Modules with dynamic imports

## 📚 Documentation

For detailed setup instructions, troubleshooting, and architecture decisions, see:
- **[DEVELOPER_GUIDE.md](./DEVELOPER_GUIDE.md)** - Complete developer documentation with all challenges and solutions
- **[ADDING_NEW_ANGULAR_REMOTE.md](./ADDING_NEW_ANGULAR_REMOTE.md)** - Step-by-step guide to add additional Angular micro front-ends

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Running the Applications

You need to run both applications simultaneously:

#### 1. Start the Angular Remote Application

```bash
cd angular-remote
npm install
npm start
```

The Angular remote will run on **http://localhost:4201**

#### 2. Start the React Host Application

In a new terminal:

```bash
cd react-host
npm install
npm start
```

The React host will run on **http://localhost:3000**

### Accessing the Application

Open your browser and navigate to **http://localhost:3000**

You should see the React host application with the Angular remote application embedded within it.

## How It Works

### React Host

- Uses CRACO to customize webpack configuration
- Configures Module Federation to consume the Angular remote
- Dynamically imports and mounts the Angular application

### Angular 21 Remote

- Uses **Native Federation** (esbuild-based, not webpack)
- Exposes a bootstrap module with `mount` and `unmount` functions
- Runs on port 4201 and serves the remote entry point

## Module Federation Configuration

### React Host (`craco.config.js`)

```javascript
remotes: {
  angularRemote: 'angularRemote@http://localhost:4201/remoteEntry.js',
}
```

### Angular Remote (`federation.config.js`)

```javascript
name: 'angular-remote',
exposes: {
  './Component': './src/bootstrap.ts',
}
```

## Important Notes

- **Angular 21 Build System**: Angular 21 no longer uses webpack by default. It uses esbuild for faster builds. This is why we use `@angular-architects/native-federation` instead of the traditional webpack Module Federation plugin.

- **Port Configuration**:
  - React Host: 3000
  - Angular Remote: 4201

- **Execution Order**: Always start the Angular remote application first, then the React host.

## Troubleshooting

### Common Issues

1. **Cannot load remote**: Ensure the Angular remote is running before starting the React host
2. **CORS errors**: Both applications should be running on localhost
3. **Port conflicts**: Check that ports 3000 and 4201 are available

## Technology Stack

- React 19
- Angular 21
- TypeScript
- Module Federation / Native Federation
- CRACO (Create React App Configuration Override)
- esbuild (Angular 21's build tool)
