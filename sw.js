/* متحف إرث الحضارة - Service Worker
   يخزن الأصول الأساسية (HTML/CSS/JS/الشعار) عشان الموقع يفتح حتى بدون إنترنت،
   ويستخدم شبكة أولاً لصفحات الأدمن/الحساب (Firebase) عشان تفضل محدثة دايمًا. */

const CACHE_NAME = 'museum-heritage-v3';
const CORE_ASSETS = [
  './',
  './index.html',
  './style.css',
  './features.css',
  './script.js',
  './features.js',
  './auth.js',
  './i18n.js',
  './logo.png',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // متجاهلين طلبات Firebase وأي دومين خارجي غير أصول الموقع نفسه (عشان تفضل بيانات الحساب لايف)
  if (url.origin !== self.location.origin) return;
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response && response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});

/* استقبال إشعارات Push (يحتاج إعداد Firebase Cloud Messaging من طرفك أولاً) */
self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch (e) {}
  const title = data.title || 'متحف إرث الحضارة';
  const options = {
    body: data.body || 'في انتظارك تحديثات وحضارات جديدة في المتحف!',
    icon: './logo.png',
    badge: './logo.png',
    data: { url: data.url || './' }
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || './';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((list) => {
      for (const client of list) {
        if (client.url.includes(url) && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
