import { createApplication } from '@angular/platform-browser';
import { isDevMode } from '@angular/core';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { PremiumInfo } from './app/premium-info';
import { premiumReducer } from './app/store/premium.reducer';

/**
 * Bootstrap function for PremiumInfo standalone component
 * This allows the component to be loaded as a micro front-end
 *
 * IMPORTANT: This component shares the same NgRx store configuration
 * as the main application to enable communication between components
 */
export async function mount(container: HTMLElement): Promise<void> {
  // Inject styles scoped to this container
  const stylesUrl = 'http://localhost:4201/styles.css';
  const styleId = 'premium-info-styles';

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
      console.log('Premium Info styles injected and scoped to container');
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

  const appRef = await createApplication({
    providers: [
      provideStore({ premium: premiumReducer }),
      provideStoreDevtools({
        maxAge: 25,
        logOnly: !isDevMode(),
        autoPause: true,
        trace: false,
        traceLimit: 75,
      })
    ]
  });

  const componentRef = appRef.bootstrap(PremiumInfo, container);
  console.log('PremiumInfo component mounted successfully with NgRx store');
}

/**
 * Unmount function to clean up the component
 */
export function unmount(): void {
  console.log('PremiumInfo component unmounted');
}

// Export the component for direct use
export { PremiumInfo };
