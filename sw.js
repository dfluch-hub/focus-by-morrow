'use strict';
const V='2.0.0', C=`focus-morrow-${V}`;
const CORE=['./','./index.html','./app.js?v=2.0.0','./manifest.json?v=2.0.0'];

self.addEventListener('install',e=>e.waitUntil((async()=>{
  const c=await caches.open(C);
  for(const a of CORE){
    try{
      const r=await fetch(a,{cache:'no-store'});
      if(r.ok) await c.put(a,r.clone());
    }catch{}
  }
  await self.skipWaiting();
})()));

self.addEventListener('activate',e=>e.waitUntil((async()=>{
  for(const k of await caches.keys()){
    if(k.startsWith('focus-morrow-')&&k!==C) await caches.delete(k);
  }
  await self.clients.claim();
})()));

self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET') return;
  const u=new URL(e.request.url);
  if(u.origin!==self.location.origin) return;
  e.respondWith((async()=>{
    try{
      const fresh=await fetch(e.request,{cache:'no-store'});
      if(fresh.ok){
        const c=await caches.open(C);
        c.put(e.request,fresh.clone()).catch(()=>{});
      }
      return fresh;
    }catch{
      return await caches.match(e.request)
        || (e.request.mode==='navigate' ? await caches.match('./index.html') : null)
        || new Response('Offline',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
    }
  })());
});