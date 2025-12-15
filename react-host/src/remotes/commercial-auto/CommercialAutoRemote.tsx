import React, { useEffect, useRef, useState } from 'react';
import { getImportMapLoader } from '../../utils/importMapLoader';
import { CommercialAutoConfig } from './config';
import './CommercialAutoRemote.css';

const CommercialAutoRemote: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const loadCommercialAutoApp = async () => {
      try {
        console.log('Loading Commercial Auto UI with dynamic import maps...');
        setInitializing(true);

        // Step 1: Initialize import maps dynamically
        const importMapLoader = getImportMapLoader(CommercialAutoConfig.remoteUrl);
        await importMapLoader.initialize();

        console.log('Import maps initialized, loading Commercial Auto UI component...');

        // Step 2: Get the component URL
        const componentUrl = importMapLoader.getExposedComponentUrl(CommercialAutoConfig.componentKey);
        console.log('Loading component from:', componentUrl);

        setInitializing(false);

        // Step 3: Load the commercial-auto-app.js
        const angularModule = await import(
          /* webpackIgnore: true */
          /* @vite-ignore */
          componentUrl
        );

        console.log('Commercial Auto UI module loaded:', angularModule);

        // Step 4: Mount the Angular application
        if (containerRef.current && angularModule.mount) {
          await angularModule.mount(containerRef.current);
          setLoaded(true);
          console.log('Commercial Auto UI mounted successfully');
        } else {
          console.error('Mount function not found in module:', angularModule);
          setError('Mount function not found in Commercial Auto UI module');
        }
      } catch (err) {
        console.error('Failed to load Commercial Auto UI:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setInitializing(false);
      }
    };

    loadCommercialAutoApp();

    // Cleanup on unmount
    return () => {
      // Optional: Implement unmount logic if needed
    };
  }, []);

  return (
    <div className="commercial-auto-remote">
      <div className="remote-header">
        <h2>Commercial Auto Insurance Application</h2>
      </div>

      {error && (
        <div className="error-message">
          <strong>Error:</strong> {error}
        </div>
      )}

      {initializing && !loaded && !error && (
        <div className="loading-message initializing">
          <div className="spinner"></div>
          <span>Initializing import maps...</span>
        </div>
      )}

      {!initializing && !loaded && !error && (
        <div className="loading-message">
          <div className="spinner"></div>
          <span>Loading Commercial Auto UI...</span>
        </div>
      )}

      <div ref={containerRef} id="commercial-auto-container"></div>
    </div>
  );
};

export default CommercialAutoRemote;
