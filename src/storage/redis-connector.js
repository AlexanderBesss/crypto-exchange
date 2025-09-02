import { createClient } from "redis";

export class RedisConnector {
    #client;

    constructor() {
        this.#client = createClient({ url: "redis://localhost:6379"});
        this.#client.on("error", (error) => console.error("Redis error:", error));
    }

    /**
     * @returns {import("redis").RedisClientType}
     */
    getClient() {
        if (!this.#client.isOpen){
            this.#client.connect();
        }
        return this.#client;
    }
}
