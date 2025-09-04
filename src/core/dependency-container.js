import { EventEmitter } from 'node:events';
import { BookController } from "../book/api/book-controller.js";
import { BookRedisRepository } from "../book/repository/book-redis-repository.js";
import { BookService } from "../book/service/book-service.js";
import { OrderBookWebSocket } from "../broadcast/api/order-book-websocket.js";
import { OrderController } from "../order/api/order-controller.js";
import { OrderRedisRepository } from "../order/repository/order-redis-repository.js";
import { OrderBroadcastService } from "../broadcast/service/order-broadcast-service.js";
import { OrderService } from "../order/service/order-service.js";
import { RedisConnector } from "../resource/redis-connector.js";

const WSS_SERVER_KEY = 'WsServer';
const HTTP_SERVER_KEY = 'HttpServer';
const ORDER_EVENT_EMITTER_KEY = 'OrderEventEmitter';

export class DependencyContainer {
    static #dependencies = new Map();
    constructor(httpServer, wsServer = undefined) {
        DependencyContainer.#dependencies.set(HTTP_SERVER_KEY, httpServer);
        DependencyContainer.#dependencies.set(WSS_SERVER_KEY, wsServer);
        DependencyContainer.#register();
        console.log("Registered dependencies: ", DependencyContainer.#dependencies.keys());
    }

    static #register() {
        // Register dependencies here (order matters)

        // Event emitters
        this.#dependencies.set(ORDER_EVENT_EMITTER_KEY, new EventEmitter());

        // Resources
        this.#dependencies.set(RedisConnector.name, new RedisConnector());

        // Repositories
        this.#dependencies.set(BookRedisRepository.name, new BookRedisRepository(this.get(RedisConnector.name)));
        this.#dependencies.set(OrderRedisRepository.name, new OrderRedisRepository(this.get(RedisConnector.name)));

        // Services
        this.#dependencies.set(BookService.name, new BookService(this.get(BookRedisRepository.name)));
        this.#dependencies.set(OrderBroadcastService.name, new OrderBroadcastService(this.get(WSS_SERVER_KEY), this.get(ORDER_EVENT_EMITTER_KEY)));
        this.#dependencies.set(OrderService.name, new OrderService(this.get(OrderRedisRepository.name), this.get(ORDER_EVENT_EMITTER_KEY)));

        // Endpoints
        this.#dependencies.set(OrderController.name, new OrderController(this.get(OrderService.name)));
        this.#dependencies.set(OrderBookWebSocket.name, new OrderBookWebSocket(this.get(WSS_SERVER_KEY), this.get(OrderBroadcastService.name)));
        this.#dependencies.set(BookController.name, new BookController(this.get(BookService.name)));
    }

    static get(name) {
        const dependency = this.#dependencies.get(name);
        if (!dependency) {
            throw new Error(`Dependency ${name} not found!`);
        }
        return dependency;
    }
}
