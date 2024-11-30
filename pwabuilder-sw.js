const CACHE_NAME = "work-break-timer-cache-v1";
const ASSETS_TO_CACHE = [
    "/Work-Break-Timer/", // GitHub Pages root directory for the app
    "/Work-Break-Timer/index.html",
    "/Work-Break-Timer/style.css",
    "/Work-Break-Timer/script.js",
    "/Work-Break-Timer/manifest.json",
    "/Work-Break-Timer/pwabuilder-sw.js",
    "/Work-Break-Timer/W&BTicon.jpg",
    "/Work-Break-Timer/good-6081.mp3"
];

// Install event: Cache all the assets
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

// Activate event: Clean up old caches if needed
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});

// Fetch event: Serve files from the cache if available
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            return cachedResponse || fetch(event.request);
        })
    );
});
