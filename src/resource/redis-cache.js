export class RedisCache {
    #redisClient;

    constructor(redisConnector){
        const redisClientPromise = redisConnector.getClient();
        redisClientPromise.then(client => { 
            this.#redisClient = client
         });
    }

    async get(cacheKey, cachedFunctionCallback, ...params){
        const oldCached = await this.#redisClient.get(cacheKey);
        if (oldCached) {
            return JSON.parse(oldCached);
        }
        const newCached = await cachedFunctionCallback(...params);
        if(newCached){
             await this.#redisClient.set(cacheKey, JSON.stringify(newCached), { EX: 30 });
        }
        return newCached;
    }
}
