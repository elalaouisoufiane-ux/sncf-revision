/* Cache applicatif simple pour une utilisation hors ligne quand le site est servi en HTTP. */
var CACHE_NAME = "sncf-traction-academy-v12";
var OFFLINE_FILES = [
  "index.html",
  "manifest.webmanifest",
  "images/icon.svg",
  "css/base.css",
  "css/app.css",
  "data/definitions.js",
  "data/abbreviations.js",
  "data/vocabulary.js",
  "data/courses.js",
  "data/summaries.js",
  "data/journal.js",
  "js/storage.js",
  "js/ui.js",
  "js/app.js"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(OFFLINE_FILES);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(names.map(function (name) {
        if (name !== CACHE_NAME) {
          return caches.delete(name);
        }
        return null;
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", function (event) {
  if (event.request.method !== "GET") {
    return;
  }
  event.respondWith(
    fetch(event.request).then(function (response) {
      var copy = response.clone();
      caches.open(CACHE_NAME).then(function (cache) {
        cache.put(event.request, copy);
      });
      return response;
    }).catch(function () {
      return caches.match(event.request).then(function (cached) {
        if (cached) {
          return cached;
        }
        return caches.match("index.html");
      });
    })
  );
});
