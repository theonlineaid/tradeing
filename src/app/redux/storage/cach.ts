// src/cacheStorage.js
const cacheStorage = {
    getItem: async (key) => {
      const cache = await caches.open('redux-persist-cache');
      const response = await cache.match(key);
      const data = await response?.json();
      return data;
    },
  
    setItem: async (key, data) => {
      const cache = await caches.open('redux-persist-cache');
      const response = new Response(JSON.stringify(data));
      await cache.put(key, response);
    },
  
    removeItem: async (key) => {
      const cache = await caches.open('redux-persist-cache');
      await cache.delete(key);
    },
  };
  
  export default cacheStorage;
  