const C='mv-v39';
const SHELL=['./','index.html','manifest.webmanifest','icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 const r=e.request;if(r.method!=='GET')return;
 const u=new URL(r.url);
 const own=u.origin===location.origin;
 const font=u.hostname==='fonts.googleapis.com'||u.hostname==='fonts.gstatic.com';
 if(!own&&!font)return;
 if(own){
  // réseau d'abord : le code est toujours à jour quand il y a du réseau, le cache sert hors-ligne
  e.respondWith(fetch(r,{cache:'no-cache'}).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp))}return res}).catch(()=>caches.open(C).then(c=>c.match(r,{ignoreSearch:true}))));
  return;
 }
 e.respondWith(caches.open(C).then(c=>c.match(r).then(m=>{
  const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());return res}).catch(()=>m);
  return m||net;
 })));
});
