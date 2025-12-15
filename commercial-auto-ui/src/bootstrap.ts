import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { ApplicationRef } from '@angular/core';

let appRef: ApplicationRef | null = null;

/**
 * Mount function - Called by React host to initialize Angular app
 * @param container - HTML element where Angular app should be mounted
 */
export const mount = async (container: HTMLElement) => {
  if (appRef) {
    console.warn('Commercial Auto UI app already mounted');
    return;
  }

  // Create an app-root element in the container
  const appRoot = document.createElement('app-root');
  container.appendChild(appRoot);

  // Bootstrap the application
  appRef = await bootstrapApplication(App, appConfig);
  console.log('Commercial Auto UI app mounted successfully');
};

/**
 * Unmount function - Called by React host to destroy Angular app
 */
export const unmount = () => {
  if (appRef) {
    appRef.destroy();
    appRef = null;
    console.log('Commercial Auto UI app unmounted');
  }
};

// Only bootstrap automatically when running standalone
if (document.querySelector('app-root')) {
  bootstrapApplication(App, appConfig).catch((err) => console.error(err));
}
