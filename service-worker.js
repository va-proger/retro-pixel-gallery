const CACHE = "retro-pixel-cache-v2";

const ASSETS = [
    "./",
    "./index.html",
    "./manifest.json",
    "./assets/style/style.css",
    "./assets/js/main.js",

    // модули
    "./assets/js/config.js",
    "./assets/js/utils.js",
    "./assets/js/audio.js",
    "./assets/js/crt.js",
    "./assets/js/gallery.js",
    "./assets/js/modal.js",
    "./assets/js/pixelate.js",
    "./assets/js/download.js",
    "./assets/js/storage.js",
    "./assets/js/vendor/jszip.min.js",
    "./assets/js/vendor/jszip.esm.js",

    // картинки
    "./assets/images/preview.png",
    // "./assets/images/green_cat-cosmos.png",
    // "./assets/images/green_dragon.png",
    // "./assets/images/green_marh.png"
];

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener("fetch", (e) => {
    e.respondWith(
        caches.match(e.request).then((res) => res || fetch(e.request))
    );
});
