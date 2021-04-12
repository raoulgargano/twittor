importScripts('js/sw-utils.js');

const CACHE_STATIC_APP = 'static_v1.0.5'; // Para librerias base de nuestra app
const CACHE_INMUTABLE_APP = 'inmutable_v1.0.1'; // Para librerias de tercero o elemento que no pueden cambiar

const CACHE_DYNAMIC_APP = 'dynamic_v1.0.2'; // Para librerias  o elemento dinamico
const NUM_MAX_DYAMIC = 50; // Elemento max cache dinamica

// Elemento/librerias base/esenciales de nuestra app
const APP_SHELL = [
    // '/', // solo en desarollo localhost
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

// Elementos/librerias que no se van a cambiar
const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];

// INIT EVENT INSTALL
self.addEventListener('install', e => {
    const cacheStatic = caches.open( CACHE_STATIC_APP ).then( cache => cache.addAll(APP_SHELL))
    const cacheInmutable = caches.open( CACHE_INMUTABLE_APP ).then( cache => cache.addAll(APP_SHELL_INMUTABLE))
    const cacheElementInstall =  [cacheStatic, cacheInmutable]

    e.waitUntil( Promise.all(cacheElementInstall) );
})

// CACHE CLEAN
self.addEventListener( 'activate', e => {
    const CacheCleanOldVersion = caches.keys().then( keys => {
        keys.forEach( key => {
            if ( key !== CACHE_STATIC_APP && key.includes('static')){
                return caches.delete(key)
            }
            if ( key !== CACHE_DYNAMIC_APP && key.includes('dynamic')){
                return caches.delete(key)
            }
            if ( key !== CACHE_INMUTABLE_APP && key.includes('inmutable')){
                return caches.delete(key)
            }
        })
    })
    e.waitUntil( CacheCleanOldVersion );
});

// CACHE STRATEGY
self.addEventListener( 'fetch', e => {
    const CacheFallBackNetwork = caches.match( e.request ).then( respCache => {
        if (respCache) {
            return respCache;
        } else {
            console.log('Este url no existe en cache', e.request.url)
            return  fetch( e.request ).then( urlResp => {
                return saveDynamicCache(CACHE_DYNAMIC_APP, e.request, urlResp)
            })
        }
    })
    e.respondWith( CacheFallBackNetwork );
});
