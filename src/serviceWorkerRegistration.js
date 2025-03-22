// Ce fichier optional peut être copié à partir de create-react-app
// Source: https://github.com/facebook/create-react-app/blob/main/packages/cra-template-pwa/template/src/serviceWorkerRegistration.js

// Ce code en option permet à votre application de fonctionner plus vite sur les visites répétées et
// vous donne des capacités hors ligne. Cependant, cela signifie également que les développeurs (et les utilisateurs)
// ne verront les mises à jour déployées qu'à la visite suivante de la page, après la fermeture de tous les onglets
// pour la page. C'est la fenêtre de "service worker".

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] est l'adresse IPv6 localhost.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 sont considérées comme localhost pour IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

export function register(config) {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // Le constructeur URL est disponible dans tous les navigateurs qui supportent SW.
    const publicUrl = new URL(process.env.PUBLIC_URL, window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // Notre service worker ne fonctionnera pas si PUBLIC_URL est sur une origine différente
      // de celle de notre page. Cela pourrait se produire si un CDN est utilisé pour
      // servir les actifs; voir https://github.com/facebook/create-react-app/issues/2374
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

      if (isLocalhost) {
        // Ceci s'exécute sur localhost. Vérifions si un service worker existe toujours ou non.
        checkValidServiceWorker(swUrl, config);

        // Ajoutez quelques journaux supplémentaires sur localhost, pointant les développeurs vers la
        // documentation du service worker/PWA.
        navigator.serviceWorker.ready.then(() => {
          console.log(
            'Cette application web est servie en cache-first par un service ' +
              'worker. Pour en savoir plus, visitez https://cra.link/PWA'
          );
        });
      } else {
        // N'est pas localhost. Enregistrez simplement le service worker
        registerValidSW(swUrl, config);
      }
    });
  }
}

function registerValidSW(swUrl, config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // A ce stade, l'ancien contenu aura été purgé et
              // le nouveau contenu aura été ajouté au cache.
              // C'est le moment idéal pour afficher un message "Nouveau contenu disponible ;
              // veuillez actualiser." dans votre interface utilisateur web.
              console.log('Nouveau contenu disponible; veuillez actualiser.');

              // Exécuter le callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // A ce stade, tout a été précaché.
              // C'est le moment idéal pour afficher un message
              // "Le contenu est mis en cache pour une utilisation hors ligne." dans votre interface utilisateur web.
              console.log('Le contenu est mis en cache pour une utilisation hors ligne.');

              // Exécuter le callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Erreur pendant l\'enregistrement du service worker:', error);
    });
}

function checkValidServiceWorker(swUrl, config) {
  // Vérifiez si le service worker peut être trouvé. S'il ne peut pas être chargé, rechargez la page.
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      // Assurez-vous que le service worker existe et que nous obtenons vraiment un fichier JS.
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // Aucun service worker trouvé. Probablement une application différente. Rechargez la page.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker trouvé. Procédez normalement.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('Aucune connexion Internet trouvée. L\'application s\'exécute en mode hors ligne.');
    });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}
