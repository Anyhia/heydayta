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
              if (
                newWorker.state === 'installed' &&
                navigator.serviceWorker.controller
              ) {
                // New version is waiting - notify the app
                if (onUpdateFound) onUpdateFound(newWorker);
              }
            });
          });
        });

      // Only reload when the user explicitly requests the update (and it's a genuine update)
      let hadController = !!navigator.serviceWorker.controller;
      let refreshing = false;
      
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing && hadController) {
          refreshing = true;
          window.location.reload();
        }
      });
    });
  }
}