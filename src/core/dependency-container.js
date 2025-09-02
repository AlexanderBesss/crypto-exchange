import { OrderActionController } from "../order/api/order-action-controller.js";
import { OrderBookWebSocket } from "../order/api/order-book-websocket.js";
import { OrderActionService } from "../order/service/order-action-service.js";
import { OrderBookService } from "../order/service/order-book-service.js";
import { RedisConnector } from "../resource/redis-connector.js";

const WSS_SERVER_KEY = 'WsServer';
const HTTP_SERVER_KEY = 'HttpServer';

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

        // Resources
        this.#dependencies.set(RedisConnector.name, new RedisConnector());

        // Services
        this.#dependencies.set(OrderActionService.name, new OrderActionService());
        this.#dependencies.set(OrderBookService.name, new OrderBookService(this.get(WSS_SERVER_KEY)));

        // Endpoints
        this.#dependencies.set(OrderActionController.name, new OrderActionController(this.get(OrderActionService.name)));
        this.#dependencies.set(OrderBookWebSocket.name, new OrderBookWebSocket(this.get(WSS_SERVER_KEY), this.get(OrderBookService.name)));
    }

    static get(name) {
        const dependency = this.#dependencies.get(name);
        if (!dependency) {
            throw new Error(`Dependency ${name} not found!`);
        }
        return dependency;
    }
}
