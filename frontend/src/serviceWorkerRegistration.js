import * as Sentry from '@sentry/browser';

export function register(onUpdateFound) {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          registration.update();
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                if (onUpdateFound) onUpdateFound(newWorker);
              }
            });
          });
        })
        .catch((error) => {
          console.error('Service worker registration failed:', error);
          Sentry.captureException(error);
        });
    });
  }
}