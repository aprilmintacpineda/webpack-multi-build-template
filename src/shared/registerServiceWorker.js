import { addPassiveListener } from '_shared/helpers';

if ('serviceWorker' in navigator) {
  addPassiveListener(window, 'load', () => {
    window.navigator.serviceWorker
      .register('serviceWorker.js')
      .then(registration => {
        registration.onupdatefound = () => {
          const installingWorker = registration.installing;

          installingWorker.onstatechange = () => {
            if (
              installingWorker.state === 'installed' &&
              window.navigator.serviceWorker.controller
            ) {
              // eslint-disable-next-line
              console.log('new contents available');
            }
          };
        };
      })
      .catch(err => {
        // eslint-disable-next-line
        console.error(`Could not register service worker > ${err.message}`);
      });
  });
} else {
  // eslint-disable-next-line
  console.error('Could not register service worker > unsupported');
}
