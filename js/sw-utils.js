const saveDynamicCache = (dynamicCache, req, res) => {
    if(res.ok){
        return caches.open(dynamicCache).then( cache => {
            cache.put(req, res.clone());
            return res.clone();
        })
    } else {
        return res;
    }
}

const removeCacheElements = (cacheName, numerItems) => {
    caches.open(cacheName).then( cache => {
        return cache.keys().then( keys => {
            if(keys.length > numerItems ){
                cache.delete(keys[0]).then( removeCacheElements(cacheName, numerItems) )
            }
        })
    })
}
