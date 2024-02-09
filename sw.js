//Asignar nombre y version de la cache
const CACHE_NAME='v1,cache_BCH_PWA';

//configuracion de los ficheros a subir a la cache de la aplicacion
var urlsToCache= [
    './'
];


self-addEventListener('install', e => {
    //utilizamos la variable del evento

    e.waitUntil(
        caches.open(CACHE_NAME)
                .then(cache => {
                    //le mandamos los elementos que tenemos en el array
                    return cache.addAll(urlsToCache)
                                .then(()=>{
                                    self.skipWaiting();
                                })
                })
                .catch(err=>console.log("No se ha registrado el cache", err))
    );
    
});

self.addEventListener('activate', e => {
    const cacheWhitelist = [CACHE_NAME];

    //Que el evento espere a que termine de ejecutar
    e.waitUntil(
        caches.keys()
            .then(CacheNames=>{
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if(cacheWhitelist.indexOf(cacheName)== -1)
                        {
                            //borrar elementos que no se necesitan
                            return cache.delete(cacheName);
                        }
                    })
                );
            })
            .then(()=>{
                self.clients.claim(); //activa la cache en el dispositivo

            })
    );
})

//evento fetch
//Consigue la informacion de internet... hace una consulta al backend
//Cuando se salta de una pagina a otra pagina... por ejemplo
//cehca si ya tiene los recursos en cache y sino los solicita.

self.addEventListener('fetch',e => {
    e.respondWith(
        caches.match(e.request)
            .then(res => {
                if(res){
                    //Devuelde datos desde cache
                    return res;
                }
                return fetch(e.request);//hago la peticion al servidor en caso de que no este en cache

            })
    );
});