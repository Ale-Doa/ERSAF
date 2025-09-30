// Service Worker per gestire le notifiche push

self.addEventListener('push', function(event) {
  if (!event.data) {
    return;
  }

  const data = event.data.json();
  const title = data.title || 'Weather App';
  const options = {
    body: data.body || 'Nuova notifica',
    icon: data.icon || '/weather-icon.png',
    badge: data.badge || '/badge-icon.png',
    data: data.data || {},
    vibrate: [200, 100, 200],
    tag: 'weather-alert',
    requireInteraction: true
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/dashboard')
  );
});

self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(clients.claim());
});
