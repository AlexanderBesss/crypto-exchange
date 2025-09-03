export class OrderRepository {
    constructor(redisClient) {
        this.redisClient = redisClient;
    }

    async createOrder(orderId, orderData) {
        await this.redisClient.hset('orders', orderId, JSON.stringify(orderData));
    }

    async getOrder(orderId) {
        const orderData = await this.redisClient.hget('orders', orderId);
        return orderData ? JSON.parse(orderData) : null;
    }

    async updateOrder(orderId, updatedData) {
        const existingOrder = await this.getOrder(orderId);
        if (existingOrder) {
            const newOrderData = { ...existingOrder, ...updatedData };
            await this.redisClient.hset('orders', orderId, JSON.stringify(newOrderData));
        }
    }
    
    async deleteOrder(orderId) {
        await this.redisClient.hdel('orders', orderId);
    }

    async listOrders() {
        const orders = await this.redisClient.hgetall('orders');
        return Object.entries(orders).map(([id, data]) => ({ orderId: id, ...JSON.parse(data) }));
    }
}
