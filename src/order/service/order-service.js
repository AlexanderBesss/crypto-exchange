import { ConflictError, NotFoundError } from "../../core/response/http-response-type.js";
import { Order, SellOrderInput } from "../model/order.js";
import { OrderRedisRepository } from "../repository/order-redis-repository.js";

export class OrderService {
    #orderRepository;

    /**
     * @param {OrderRedisRepository} orderRepository
     */
    constructor(orderRepository) {
        this.#orderRepository = orderRepository;
    }

    /**
     * 
     * @param {*} bookId 
     * @returns {Promise<{ ask: Order[], bid: Order[] }>}
     */
    async getOrdersByBook(bookId){
        const ordersInBook = await this.#orderRepository.findAllByBookId(bookId);
        const askOrders = [];
        const bidOrders = [];
        ordersInBook.forEach(order=>{
            if(order.type === 'ask'){
                askOrders.push(order);
            }else{
                bidOrders.push(order);
            }
        });
        const orders = {
            ask: askOrders,
            bid: bidOrders.reverse()
        };
        return orders;
    }

    /**
     * Sell order if it matches by price and amount (to simplify process)
     * @param {SellOrderInput} orderInput 
     * @returns {Promise<Order>}
     */
    async sellOrder(orderInput) {
        const orderId = `order:${crypto.randomUUID()}`;
        const similarOrders = await this.#orderRepository.findSimilarOrders(orderInput);
        const orderToSell = this.#findOrderToSell(orderInput, similarOrders);
        if(orderToSell){
            return this.closeOrder(orderToSell);
        }
        const { bid } = await this.getOrdersByBook(orderInput.bookId);
        const orderType = bid[0] && bid[0].price < orderInput.price ? "ask" : "bid" 
        const order = new Order(
            orderId,
            orderInput.bookId,
            orderInput.price,
            orderInput.amount,
            orderType,
            'open'
        );
        
        // emit order created event
        return await this.#orderRepository.createOrder(order);
    }

    /**
     * @param {String} orderId
     * @returns {Promise<Order>}
     */
    async buyOrder(orderId) {
        const order = await this.#orderRepository.findOrderById(orderId);
        if (!order) {
            throw new NotFoundError(`Order ${orderId} not found!`);
        }
        if(order.type === "bid"){
            throw new ConflictError("You can't buy BID order!");
        }
        const closedOrder = await this.closeOrder(order);
        return closedOrder;
    }

    /**
     * @param {String} orderId
     * @returns {Promise<Order>}
     */
    async cancelOrder(orderId) {
        const order = await this.#orderRepository.findOrderById(orderId);
        if (!order) {
            throw new NotFoundError(`Order ${orderId} not found!`);
        }
        const cancelledOrder = {
            ...order, status: "cancelled"
        };
        await this.#orderRepository.deleteOrder(order.bookId, orderId);
        // emit order cancelled event
        return cancelledOrder;
    }

    async closeOrder(order){
        const closedOrder = {
            ...order,
            status: 'closed'
        }
        await this.#orderRepository.deleteOrder(order.bookId, order.orderId);
        // emit order closed event

        return closedOrder;
    }

     /**
     * @param {SellOrderInput} order 
     * @param {Order[]} ordersInBook 
     */
    #findOrderToSell(order, ordersInBook){
        const bidOrders = this.#filterByType(ordersInBook, 'bid');
        const orderToSell = this.#findOrderByPriceAndAmount(order, bidOrders);
        return orderToSell;
    }

    /**
     * @param {Order[]} orders
     * @param {'ask' | 'bid'} type
     */
    #filterByType(orders, type){
        return orders.filter(order=> order.type=== type);
    }

    /**
     * @param {SellOrderInput} inputOrder 
     * @param {Order[]} orders 
     */
    #findOrderByPriceAndAmount(inputOrder, orders){
        return orders.find(order=> order.price === inputOrder.price && order.amount === inputOrder.amount);
    }

}
