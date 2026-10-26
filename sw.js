const V="vsb-v2";
const FILES=["./","index.html","style.css","app.js","data.js","manifest.webmanifest","icon.svg"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const u=new URL(e.request.url);
  if(u.pathname.endsWith("api.php"))return;
  e.respondWith(fetch(e.request).then(r=>{if(r&&(r.ok||r.type==="opaque")){const c=r.clone();caches.open(V).then(x=>x.put(e.request,c))}return r}).catch(()=>caches.match(e.request).then(m=>m||caches.match("index.html"))));
});
