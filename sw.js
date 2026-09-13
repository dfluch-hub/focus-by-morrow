'use strict';
const V='1.7.0';
const C='focus-morrow-v'+V;
const CORE=['./','./index.html','./app.js?v='+V,'./styles.css?v='+V,'./manifest.json?v='+V];
const OPTIONAL=['./icon.svg','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(C);for(const asset of CORE){const response=await fetch(asset,{cache:'no-store'});if(!response.ok)throw new Error('Core asset failed: '+asset);await cache.put(asset,response.clone())}for(const asset of OPTIONAL){try{const response=await fetch(asset,{cache:'no-store'});if(response.ok)await cache.put(asset,response.clone())}catch{}}await self.skipWaiting()})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('focus-morrow-')&&key!==C)await caches.delete(key);await self.clients.claim()})()));
self.addEventListener('message',event=>{if(event.data?.type==='SKIP_WAITING')self.skipWaiting()});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith((async()=>{try{const response=await fetch(event.request,{cache:'no-store'});if(response.ok){const cache=await caches.open(C);cache.put(event.request,response.clone())}return response}catch{return await caches.match(event.request)||await caches.match('./index.html')}})())});
