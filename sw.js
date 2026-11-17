/* Art Museum, offline copy. Built by build_app.py (version 3).
   Build round 2 (Sunday November 15 2026): the last good page and the pictures stay on the device. The wall pictures come from the
   GitHub Pages host (another origin for the Netlify site), so they get their own cache that survives new builds; on a weak signal the
   page waits at most 3.5 s for the network, then shows the copy it kept. */
const VERSION = "museum-app-v3-a0abd37cbf";
const PICS = "museum-pics-v1";
const PAGES = "https://karimet-tahiry-a11y.github.io";
const FILES = ["./", "404.html", "art/hd/rmwhkiu815m3vr.jpg", "art/hd/rmwhlyo0n6zqt.jpg", "art/hd/rmwhm6ewqfe6x.jpg", "art/m/rmwhkiu815m3vr.webp", "art/m/rmwhlyo0n6zqt.webp", "art/m/rmwhm6ewqfe6x.webp", "art/rmwhkiu815m3vr.jpg", "art/rmwhlyo0n6zqt.jpg", "art/rmwhm6ewqfe6x.jpg", "icons/apple-touch-icon.png", "icons/favicon-32.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon-maskable-512.png", "index.html", "manifest.webmanifest", "robots.txt"];
self.addEventListener("install", e => e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== VERSION && n !== PICS).map(n => caches.delete(n)))).then(() => self.clients.claim())));
const local = url => { const i = url.pathname.indexOf("/art/"); return i < 0 ? null : new URL("." + url.pathname.slice(i), self.registration.scope).href; };
async function trim(c) { const k = await c.keys(); for (const r of k.slice(0, Math.max(0, k.length - 160))) await c.delete(r); }
async function picture(req, url) {
  const c = await caches.open(PICS);
  const hit = await c.match(req); if (hit) return hit;
  try {
    const r = await fetch(req);
    if (r.ok || r.type === "opaque") { await c.put(req, r.clone()); trim(c); }
    return r;
  } catch (e) {
    const old = (await c.match(req, { ignoreSearch: true })) || (local(url) && (await caches.match(local(url), { ignoreSearch: true })));
    if (old) return old; throw e;
  }
}
async function page(req) {
  const c = await caches.open(VERSION);
  const net = fetch(req).then(r => { if (r.ok) c.put("index.html", r.clone()); return r; });
  const slow = new Promise(ok => setTimeout(ok, 3500)).then(() => c.match("index.html"));
  try { const first = await Promise.race([net, slow]); if (first) return first; return await net; }
  catch (e) { return (await c.match("index.html")) || (await caches.match("index.html")) || Response.error(); }
}
self.addEventListener("fetch", e => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin === PAGES && url.pathname.includes("/art/")) { e.respondWith(picture(req, url)); return; }
  if (url.origin !== location.origin) return;  /* the ntfy feed goes straight out */
  if (req.mode === "navigate") { e.respondWith(page(req)); return; }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then(r => r || fetch(req).then(n => {
    if (n.ok && url.pathname.includes("/art/")) { const copy = n.clone(); caches.open(PICS).then(c => c.put(req, copy)); }
    return n;
  })));
});
