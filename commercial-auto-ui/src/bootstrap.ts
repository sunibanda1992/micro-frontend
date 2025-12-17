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

  // Inject styles scoped to this container
  const stylesUrl = 'http://localhost:4201/styles.css';
  const styleId = 'angular-app-styles';

  // Check if styles are already loaded
  if (!document.getElementById(styleId)) {
    // Fetch the CSS and scope it to the container
    try {
      const response = await fetch(stylesUrl);
      let cssText = await response.text();

      // Prefix all CSS selectors with the container ID to scope them
      // This regex matches CSS selectors and prefixes them with #container-id
      const scopedCss = cssText.replace(
        /([^\r\n,{}]+)(,(?=[^}]*{)|\s*{)/g,
        (match, selector, separator) => {
          // Skip @rules, :root, and pseudo-elements
          if (selector.trim().startsWith('@') ||
              selector.trim().startsWith(':root') ||
              selector.trim() === 'html' ||
              selector.trim() === 'body') {
            return match;
          }
          // Prefix the selector with container ID
          return `#${container.id} ${selector.trim()}${separator}`;
        }
      );

      const styleElement = document.createElement('style');
      styleElement.id = styleId;
      styleElement.textContent = scopedCss;
      document.head.appendChild(styleElement);
      console.log('Angular app styles injected and scoped to container');
    } catch (error) {
      console.warn('Failed to load scoped styles, using direct link fallback:', error);
      // Fallback: inject link element (non-scoped)
      const linkElement = document.createElement('link');
      linkElement.id = styleId;
      linkElement.rel = 'stylesheet';
      linkElement.href = stylesUrl;
      document.head.appendChild(linkElement);
    }
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
