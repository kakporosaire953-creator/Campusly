// Service Worker — Network First (toujours charger depuis le réseau)
const CACHE = "campusly-v2";

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", e => {
  // Supprimer tous les anciens caches
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network first — si réseau disponible, toujours prendre la version fraîche
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  // Ne pas intercepter les requêtes Firebase/CDN
  if (e.request.url.includes("firebasejs") || e.request.url.includes("googleapis") || e.request.url.includes("gstatic")) return;

  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Mettre en cache uniquement les assets statiques
        if (e.request.url.match(/\.(css|js|png|jpg|svg|woff2)$/)) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

self.addEventListener("push", e => {
  const data = e.data?.json() || { title: "Campusly", body: "Nouvelle notification" };
  e.waitUntil(self.registration.showNotification(data.title, {
    body: data.body,
    icon: "/campusly/assets/logo.png.jpg",
  }));
});

self.addEventListener("notificationclick", e => {
  e.notification.close();
  e.waitUntil(clients.openWindow("/dashboard.html"));
});
