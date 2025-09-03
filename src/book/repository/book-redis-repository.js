import { Book } from "../model/book.js";

export class BookRedisRepository {
    #redisClientPromise;

    constructor(redisConnector) {
        this.#redisClientPromise = redisConnector.getClient();
    }

    /**
     * @returns {Promise<Book[]>}
     */
    async getAllBooks() {
        const redisClient = await this.#redisClientPromise;
        const books = [];
        let cursor = '0';
        do {
            const res = await redisClient.scan(cursor, { MATCH: 'book:*', COUNT: 100 });
            const nextCursor = res.cursor;
            const keys = res.keys; 
            cursor = nextCursor;

            for (const key of keys) {
                const bookValue = await redisClient.hGetAll(key);
                books.push(new Book(key, bookValue.pair, bookValue.name));
            }
        } while (cursor !== '0');

        return books;
    }
}
