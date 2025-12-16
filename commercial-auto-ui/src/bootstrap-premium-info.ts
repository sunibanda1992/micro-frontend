import { createApplication } from '@angular/platform-browser';
import { PremiumInfo } from './app/premium-info';

/**
 * Bootstrap function for PremiumInfo standalone component
 * This allows the component to be loaded as a micro front-end
 */
export async function mount(container: HTMLElement): Promise<void> {
  const appRef = await createApplication({
    providers: []
  });

  const componentRef = appRef.bootstrap(PremiumInfo, container);
  console.log('PremiumInfo component mounted successfully');
}

/**
 * Unmount function to clean up the component
 */
export function unmount(): void {
  console.log('PremiumInfo component unmounted');
}

// Export the component for direct use
export { PremiumInfo };
