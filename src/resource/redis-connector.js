import { createClient } from "redis";

export class RedisConnector {
    #client;

    constructor() {
        this.#client = createClient({ url: "redis://localhost:6379"});
        this.#client.on("error", (error) => console.error("Redis error:", error));
    }

    /**
     * @returns {Promise<import("redis").RedisClientType>}
     */
    async getClient() {
        if (!this.#client.isOpen){
            await this.#client.connect();
        }
        return this.#client;
    }

    async disconnect() {
        if (this.#client.isOpen){
            await this.#client.close();
        }
    }
}
