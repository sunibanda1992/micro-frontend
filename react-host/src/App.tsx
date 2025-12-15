import { Suspense, lazy } from 'react';
import './App.css';

// Lazy load remote applications
const CommercialAutoRemote = lazy(() => import('./remotes/commercial-auto/CommercialAutoRemote'));

/**
 * Main React Host Application
 *
 * This application serves as the host for multiple micro front-end applications.
 * Each remote application is loaded dynamically using Module Federation.
 */
function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1>Micro Front-End Host</h1>
          <p className="subtitle">React 19 + Module Federation</p>
        </div>
      </header>

      <main className="App-main">
        <div className="remote-container">
          <Suspense fallback={<div className="loading-fallback">Loading remote application...</div>}>
            <CommercialAutoRemote />
          </Suspense>
        </div>
      </main>

      <footer className="App-footer">
        <p>&copy; 2025 Micro Front-End Application. Built with React and Angular.</p>
      </footer>
    </div>
  );
}

export default App;
