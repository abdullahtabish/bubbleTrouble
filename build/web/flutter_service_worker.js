'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "assets/AssetManifest.json": "dd359b3859eaa2cb1cdfeaa9c0b76c97",
"assets/FontManifest.json": "cf067bd47b79db2902360d1ffe210994",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/fonts/PressStart2P-Regular.ttf": "74496d9086d97aaeeafb3085e9957668",
"assets/images/mainChar.png": "bb0e37a86e86538dbbace6561dd4f9fc",
"assets/NOTICES": "8b5f0b8e497484f7604f333baa4fbc5b",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"favicon.ico": "be48d711bf1073569170bf80bfbd76e8",
"icons/android-icon-144x144.png": "6fa306a9caf53124bd853c34e9484553",
"icons/android-icon-192x192.png": "e3f27a035bc2fb7136ae5522ba38e4f2",
"icons/android-icon-36x36.png": "5ca05393d00559e85512ed2f6d959859",
"icons/android-icon-48x48.png": "131ed3603a5b746ab14efc48b4f12fb4",
"icons/android-icon-72x72.png": "abd9cb99ca34c79328b8aac5506543c2",
"icons/android-icon-96x96.png": "341d380e9ae2fb741bc00215d3a2b2b0",
"icons/apple-icon-114x114.png": "fabd761b3dda550af20c5bc499b62902",
"icons/apple-icon-120x120.png": "e2587da7a032fd5e929075bce9d37af7",
"icons/apple-icon-144x144.png": "6fa306a9caf53124bd853c34e9484553",
"icons/apple-icon-152x152.png": "1eb0a3be1428df7148336fdd681179c9",
"icons/apple-icon-180x180.png": "1f703ca00a199bd9f473ec0dc81725b9",
"icons/apple-icon-57x57.png": "395cc0359a36998b856bc653ede0beaf",
"icons/apple-icon-60x60.png": "f151834f836685c2869961ebdb32b3ca",
"icons/apple-icon-72x72.png": "abd9cb99ca34c79328b8aac5506543c2",
"icons/apple-icon-76x76.png": "e4f0fbfddd99ce163fe7345a49ba676d",
"icons/apple-icon-precomposed.png": "9e8aa6559741b28b92e93a51427c89e4",
"icons/apple-icon.png": "9e8aa6559741b28b92e93a51427c89e4",
"icons/browserconfig.xml": "653d077300a12f09a69caeea7a8947f8",
"icons/favicon-16x16.png": "6015b9bca011fd2dd86e8faca4379c51",
"icons/favicon-32x32.png": "68174687d4ae60031d2f23d8cfa69314",
"icons/favicon-96x96.png": "341d380e9ae2fb741bc00215d3a2b2b0",
"icons/favicon.ico": "be48d711bf1073569170bf80bfbd76e8",
"icons/manifest.json": "b58fcfa7628c9205cb11a1b2c3e8f99a",
"icons/ms-icon-144x144.png": "6fa306a9caf53124bd853c34e9484553",
"icons/ms-icon-150x150.png": "0bc738e26df1238218dbe1f51f5d8fb4",
"icons/ms-icon-310x310.png": "812632f27b6413c37e01bfaad998db36",
"icons/ms-icon-70x70.png": "246627e84dc2be421916725f8fd4e711",
"index.html": "72f7df17ebc475b196c8785f2b90d51d",
"/": "72f7df17ebc475b196c8785f2b90d51d",
"main.dart.js": "4ff4bd26ed569376ca9bd3dc47d34e5a",
"manifest.json": "f340f019f1f44a30c0dbdc7bcfad8228",
"version.json": "845bc8f78a23b0c41f48fb6cf85b0a3b"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
