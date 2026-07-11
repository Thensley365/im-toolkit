/* IM Toolkit service worker — cache-first with background refresh.
   Content updates land on the *next* launch after a rebuild. */
const CACHE = "imtk-v1";
const CORE = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-180.png",
  "./icon-512.png",
  "./antibiotic_advisor.html",
  "./admission_orders.html",
  "./aki_analyzer.html",
  "./acid_base_analyzer.html",
  "./hyponatremia_analyzer.html",
  "./hyponatremia_mgmt.html",
  "./hypokalemia_analyzer.html"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;

  // stale-while-revalidate: serve cache instantly, refresh in background
  e.respondWith(
    caches.open(CACHE).then(async cache => {
      const cached = await cache.match(req, { ignoreSearch: req.mode === "navigate" });
      const network = fetch(req)
        .then(res => {
          if (res && res.ok) cache.put(req, res.clone());
          return res;
        })
        .catch(() => cached); // offline: fall back to cache
      if (cached) { e.waitUntil(network.catch(() => {})); return cached; }
      const res = await network;
      // last-ditch navigation fallback
      if (!res && req.mode === "navigate") return cache.match("./index.html");
      return res;
    })
  );
});
