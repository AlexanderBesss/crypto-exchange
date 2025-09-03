import { RedisConnector } from "../../resource/redis-connector.js";
import { Order, SellOrderInput } from "../model/order.js";

export class OrderRedisRepository {
    #redisClient;

    /**
     * @param {RedisConnector} redisConnector 
     */
    constructor(redisConnector) {
        const redisClientPromise = redisConnector.getClient();
        redisClientPromise.then(client => { 
            this.#redisClient = client
         });
    }

    /**
     * @param {String} orderId 
     * @param {Order} order 
     * @returns 
     */
    async createOrder(order) {
        await this.#redisClient.hSet(order.orderId, order);
        const relationId = this.#getRelationIdByBookId(order.bookId);
        await this.#redisClient.zAdd(relationId, {score: order.price, value: order.orderId});
        return order;
    }

    async findOrderById(orderId) {
        const order = await this.#redisClient.hGetAll(orderId);
        if( Object.entries(order).length > 0){
            return new Order(
                order.orderId,
                order.bookId,
                Number(order.price),
                Number(order.amount),
                order.type,
                order.status
            );
        }
    }

    /**
     * Return all orders with similar price in a book
     * @param {SellOrderInput} order 
     * @returns {Promise<Order[]>}
     */
    async findSimilarOrders(order) {
        const relationId = this.#getRelationIdByBookId(order.bookId);
        const orderIds = await this.#redisClient.zRangeByScore(relationId, order.price, order.price);
        return await this.findAllByIds(orderIds);
    }

    async findAllByIds(orderIds){
        const orders = [];
        for (const orderId of orderIds) {
            const order = await this.#redisClient.hGetAll(orderId);
            orders.push(new Order(
                order.orderId,
                order.bookId,
                Number(order.price),
                Number(order.amount),
                order.type,
                order.status
            ));
        }
        return orders;
    }

    /**
     * @param {String} bookId
     * @returns {Promise<Order[]>}
     */
    async findAllByBookId(bookId) {
        const relationId = this.#getRelationIdByBookId(bookId);
        const orderIds = await this.#redisClient.zRange(relationId, 0, -1);
        return await this.findAllByIds(orderIds);
    }

    async deleteOrder(bookId, orderId) {
        await this.#redisClient.del(orderId);
        const relationId = this.#getRelationIdByBookId(bookId);
        await this.#redisClient.zRem(relationId, orderId);
    }

    /**
     * @param {String} bookId 
     */
    #getRelationIdByBookId(bookId){
        const pureId = bookId.split(":")[1];
        const relationId = `orderBook:${pureId}`;
        return relationId;
    }
}
