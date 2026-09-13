'use strict';
const V='1.5.0',C='focus-morrow-v'+V,A=['./','./index.html','./app.js?v='+V,'./styles.css?v='+V,'./manifest.json?v='+V];
self.addEventListener('install',e=>e.waitUntil((async()=>{const c=await caches.open(C);for(const a of A){const r=await fetch(a,{cache:'no-store'});if(r.ok)await c.put(a,r.clone())}self.skipWaiting()})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith('focus-morrow-')&&k!==C)await caches.delete(k);await self.clients.claim()})()));
self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith((async()=>{try{const r=await fetch(e.request,{cache:'no-store'});if(r.ok){const c=await caches.open(C);c.put(e.request,r.clone())}return r}catch{return await caches.match(e.request)||await caches.match('./index.html')}})())});
