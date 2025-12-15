import React, { useEffect, useRef, useState } from 'react';
import { getImportMapLoader } from '../../utils/importMapLoader';
import { configService } from '../../services/configService';
import './CommercialAutoRemote.css';

/**
 * Commercial Auto Remote Component with Dynamic Configuration
 *
 * This component fetches the remote URL from a configuration service
 * instead of using hardcoded values, allowing for:
 * - Multi-region deployment
 * - Environment-specific URLs
 * - Runtime configuration changes
 * - A/B testing and feature flags
 */
const CommercialAutoRemoteDynamic: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [loadingConfig, setLoadingConfig] = useState(true);

  useEffect(() => {
    const loadCommercialAutoApp = async () => {
      try {
        console.log('Fetching configuration for Commercial Auto UI...');
        setLoadingConfig(true);

        // Step 1: Fetch configuration from backend API
        const remoteConfig = await configService.getRemoteConfig('commercialAuto');

        console.log('Configuration fetched:', remoteConfig);
        setLoadingConfig(false);
        setInitializing(true);

        // Step 2: Initialize import maps dynamically with fetched URL
        const importMapLoader = getImportMapLoader(remoteConfig.url);
        await importMapLoader.initialize();

        console.log('Import maps initialized, loading Commercial Auto UI component...');

        // Step 3: Get the component URL
        const componentUrl = importMapLoader.getExposedComponentUrl(remoteConfig.componentKey);
        console.log('Loading component from:', componentUrl);
        console.log('Region:', remoteConfig.region);

        setInitializing(false);

        // Step 4: Load the commercial-auto-app.js
        const angularModule = await import(
          /* webpackIgnore: true */
          /* @vite-ignore */
          componentUrl
        );

        console.log('Commercial Auto UI module loaded:', angularModule);

        // Step 5: Mount the Angular application
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
        setLoadingConfig(false);
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

      {loadingConfig && !error && (
        <div className="loading-message">
          <div className="spinner"></div>
          <span>Loading configuration...</span>
        </div>
      )}

      {!loadingConfig && initializing && !loaded && !error && (
        <div className="loading-message initializing">
          <div className="spinner"></div>
          <span>Initializing import maps...</span>
        </div>
      )}

      {!loadingConfig && !initializing && !loaded && !error && (
        <div className="loading-message">
          <div className="spinner"></div>
          <span>Loading Commercial Auto UI...</span>
        </div>
      )}

      <div ref={containerRef} id="commercial-auto-container"></div>
    </div>
  );
};

export default CommercialAutoRemoteDynamic;
