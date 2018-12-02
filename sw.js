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
    //只对 get 类型的请求进行拦截处理
    if(event.request.method !== 'GET'){
        console.log('WORKER: fetch event ignored.', event.request.method, event.request.url);
        return;
    }

    event.respondWith(
        //缓存中匹配请求
        caches.match(event.request)
            .then(function(response){
                if(response){
                    return response;
                }
                /*
                因为 event.request 流已经在 caches.match 中使用过一次
                那么该流是不能再次使用的，我们只能得到它的副本去使用
                */
                var fetchRequest = event.request.clone();

                //fetch 的通信方式，得到 Request 对象，然后发送请求
                return  fetch(fetchRequest).then(
                    function(response){
                        if(!response || response.status !== 200 || response.type !== 'basic'){
                            return response;
                        }

                        /* 
                        如果成功，该response 不是要拿来给浏览器渲染，
                        而是进行缓存由于caches.put使用的是文件响应流，
                        一旦使用那么返回的response就无法访问造成失败，所以需要复制一份 
                        */
                        var responseToCache = response.clone();

                        caches.open(CACHE_NAME)
                            .then(function(cache){
                                cache.put(event.request, responseToCache);
                            });

                            return response;
                    }
                );
            })
    )
});

self.addEventListener('message', function(event){
    
});

self.addEventListener('erroe',function(event){

});