/* Art Museum, offline copy. Built by build_app.py (version 3). */
const VERSION = "museum-app-v3-f052334f1b";
const FILES = ["./", "404.html", "art/m/rfill12121501.webp", "art/m/rfill12121624.webp", "art/m/rfill12122556.webp", "art/m/rfill12122759.webp", "art/m/rfill12122945.webp", "art/m/rfill12123137.webp", "art/m/rfill12123330.webp", "art/m/rfill12123539.webp", "art/m/rfill12194103.webp", "art/m/rfill12194544.webp", "art/m/rfill12195158.webp", "art/m/rfill12200301.webp", "art/m/rfill12201115.webp", "art/m/rfill13011515.webp", "art/m/rfill13012439.webp", "art/m/rfill13012633.webp", "art/m/rfill13081539.webp", "art/m/rfill13081815.webp", "art/m/rmwddoe0qgsb3.webp", "art/rfill12121501.jpg", "art/rfill12121624.jpg", "art/rfill12122556.jpg", "art/rfill12122759.jpg", "art/rfill12122945.jpg", "art/rfill12123137.jpg", "art/rfill12123330.jpg", "art/rfill12123539.jpg", "art/rfill12194103.jpg", "art/rfill12194544.jpg", "art/rfill12195158.jpg", "art/rfill12200301.jpg", "art/rfill12201115.jpg", "art/rfill13011515.jpg", "art/rfill13012439.jpg", "art/rfill13012633.jpg", "art/rfill13081539.jpg", "art/rfill13081815.jpg", "art/rmwddoe0qgsb3.jpg", "icons/apple-touch-icon.png", "icons/favicon-32.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "index.html", "manifest.webmanifest", "robots.txt"];
self.addEventListener("install", e => e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== VERSION).map(n => caches.delete(n)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url); if (url.origin !== location.origin) return;  /* the ntfy feed goes straight out */
  if (req.mode === "navigate") {
    e.respondWith(fetch(req).then(r => { if (r.ok) { const c = r.clone(); caches.open(VERSION).then(x => x.put("index.html", c)); } return r; })
      .catch(() => caches.match("index.html"))); return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(r => r || fetch(req)));
});
