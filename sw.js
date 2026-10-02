// Network-first navigation keeps the published game current; cache is used offline.
const CACHE='kirilma-hatti-v4.6.0';
const HOME=new URL('./index.html',self.location.href).href;
self.addEventListener('install',event=>event.waitUntil(
 caches.open(CACHE).then(cache=>cache.add(new Request(HOME,{cache:'reload'}))).then(()=>self.skipWaiting())
));
self.addEventListener('activate',event=>event.waitUntil(
 caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('kirilma-hatti-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())
));
self.addEventListener('fetch',event=>{
 if(event.request.mode!=='navigate'||new URL(event.request.url).origin!==self.location.origin)return;
 const scope=new URL('./',self.location.href).pathname;
 if(![scope,scope+'index.html'].includes(new URL(event.request.url).pathname))return;
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  try{
   const response=await fetch(event.request);
   if(response.ok){await cache.put(HOME,response.clone());return response}
   return await cache.match(HOME)||response;
  }catch{
   return await cache.match(HOME)||new Response('İlk açılış için internet bağlantısı gerekli.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
  }
 })());
});
