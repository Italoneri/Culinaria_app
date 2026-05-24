const CACHE_STATIC = 'saveur-static-v1';
const CACHE_PAGES  = 'saveur-pages-v1';
const CACHE_IMAGES = 'saveur-images-v1';

const STATIC_ASSETS = ['/', '/offline'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_STATIC).then(c => c.addAll(STATIC_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  const valid = [CACHE_STATIC, CACHE_PAGES, CACHE_IMAGES];
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => !valid.includes(k)).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const { request } = e;
  const url = new URL(request.url);

  // Static assets (JS/CSS/fonts) — cache-first, 30d
  if (request.destination === 'script' || request.destination === 'style' || request.destination === 'font') {
    e.respondWith(cacheFirst(request, CACHE_STATIC));
    return;
  }

  // Images (Supabase CDN + Unsplash) — stale-while-revalidate, 7d
  if (request.destination === 'image' || url.hostname.includes('supabase') || url.hostname.includes('unsplash')) {
    e.respondWith(staleWhileRevalidate(request, CACHE_IMAGES));
    return;
  }

  // Pages (HTML navigation) — network-first, fallback to /offline
  if (request.mode === 'navigate') {
    e.respondWith(networkFirst(request, CACHE_PAGES, '/offline'));
    return;
  }
});

async function cacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(cacheName);
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirst(request, cacheName, fallbackUrl) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    return caches.match(fallbackUrl);
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkPromise = fetch(request).then(response => {
    if (response.ok) cache.put(request, response.clone());
    return response;
  }).catch(() => null);
  return cached ?? await networkPromise;
}
