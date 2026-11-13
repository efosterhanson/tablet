importScripts("./offline-assets.js");

const CACHE_NAME = self.STUDY_CACHE_NAME;
const scope = self.registration.scope;
const localUrls = self.STUDY_LOCAL_FILES.map((path) => new URL(path, scope).href);
const requiredUrls = [...localUrls, ...self.STUDY_CDN_FILES];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Keep the previous worker active if any required file fails to download.
    for (const url of requiredUrls) {
      const response = await fetch(url, { cache: "reload" });
      if (!response.ok) throw new Error(`Offline asset failed: ${url} (${response.status})`);
      await cache.put(url, response);
    }
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.filter((name) =>
      name.startsWith("jspsych-offline-") && name !== CACHE_NAME
    ).map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

function partialVideo(request, response) {
  const range = request.headers.get("range");
  if (!range) return response;
  return response.arrayBuffer().then((bytes) => {
    const size = bytes.byteLength;
    const match = /^bytes=(\d*)-(\d*)$/i.exec(range);
    if (!match || (!match[1] && !match[2])) {
      return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
    }
    const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
    const end = match[1] && match[2] ? Math.min(Number(match[2]), size - 1) : size - 1;
    if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start >= size || end < start) {
      return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
    }
    const headers = new Headers(response.headers);
    headers.delete("Content-Encoding");
    headers.set("Content-Range", `bytes ${start}-${end}/${size}`);
    headers.set("Content-Length", String(end - start + 1));
    headers.set("Accept-Ranges", "bytes");
    return new Response(bytes.slice(start, end + 1), { status: 206, headers });
  });
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || !/^https?:/.test(request.url)) return;
  event.respondWith((async () => {
    const cached = await caches.match(request.url);
    if (cached) {
      if (request.headers.has("range") && /\.(?:mp4|m4v|mov|mp3)(?:\?|$)/i.test(request.url)) {
        return partialVideo(request, cached);
      }
      return cached;
    }

    const response = await fetch(request);
    if (response.status === 200 && new URL(request.url).origin === self.location.origin) {
      const copy = response.clone();
      event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.put(request.url, copy)));
    }
    return response;
  })());
});
