/*============== Install ================*/

self.addEventListener('install', function(event){
    event.waitUntil(
        //currentCacheName 对应调试工具中高亮部分，缓存名称
        //调用 cache.open 方法才能缓存文件
        caches.open(currentCacheName).then(function(cache){
            //arrayOfFilesToCache 为缓存文件的数组
            return cache.addAll(arrayOfFilesToCache)
        })
    );
});


/*============== Activating ================*/

self.addEventListener('activate', function(event){
    event.waitUntil(
        caches.keys().then(function(cacheName){
            return Promise.all(
                cacheNames.filter(function(cacheName){
                    return cacheName != currentCacheName;
                }).map(function(cacheName){
                    return caches.delete(cacheName);
                })
            );//end Promise.aii()
        })//end caches.key()
    );//end event.waitUntil()
});

/*============== Actived ================*/

self.addEventListener('fetch', function(event){
    
});

self.addEventListener('message', function(event){
    
});