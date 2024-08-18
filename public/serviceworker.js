/** @type {ServiceWorkerGlobalScope} */
const typedSelf = /** @type {any} */ (self);

typedSelf.addEventListener('fetch', (event) => {
  event.respondWith(doRequestAndCache(event.request));
});

/** @param request {Request} */
async function doRequestAndCache(request) {
  try {
    const response = await fetch(request);
    void storeToCache(request, response.clone());
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      console.log(`Read ${request.url} from cache`);
      return cached;
    }
    throw error;
  }
}

/**
 * @param response {Response}
 * @param request {Request}
 */
async function storeToCache(request, response) {
  // filter out files you dont want to cache here
  const cache = await caches.open('electron-asset-cache');
  cache.put(request, response);
}
