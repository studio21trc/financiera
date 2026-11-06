/* Service worker — Grupo Luján Financiera
   Red primero: siempre muestra la versión más reciente y usa la copia guardada solo si no hay internet.
   Nunca guarda datos de Firebase (solicitudes, pagos, documentos). */
const CACHE = 'lujan-v1';
const BASE = ['prestamos.html', 'admin.html', 'manifest.webmanifest', 'admin.webmanifest',
  'img/icon-96.png', 'img/icon-180.png', 'img/icon-192.png', 'img/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(BASE)).catch(() => {}));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // Firebase, fuentes, etc. van directo a la red
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok) { const copia = res.clone(); caches.open(CACHE).then(c => c.put(req, copia)); }
      return res;
    }).catch(() => caches.match(req, { ignoreSearch: true }).then(r => r || caches.match('prestamos.html')))
  );
});
