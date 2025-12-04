self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('intranet-cache').then(cache => {
      return cache.addAll([
        '/',
        '/sites/alvIntranet/SiteAssets/pwa/icons/icon-192.png',
        '/sites/alvIntranet/SiteAssets/pwa/icons/icon-512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  // Cache ONLY SiteAssets files
  if (url.pathname.startsWith('/sites/alvIntranet/SiteAssets/')) {
    event.respondWith(
      caches.match(event.request).then(response => {
        return (
          response ||
          fetch(event.request).then(fetchResponse => {
            return caches.open('intranet-cache-v1').then(cache => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            });
          })
        );
      })
    );
});

