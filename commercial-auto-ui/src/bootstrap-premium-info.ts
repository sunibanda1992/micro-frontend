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
