import { OrderActionService } from "../order/service/order-action-service.js";
import { RedisConnector } from "../storage/redis-connector.js";

export class DependencyContainer {
    static #dependencies = new Map();
    constructor() {
        DependencyContainer.#register();
    }

    static #register() {
        // Register dependencies here
        this.#dependencies.set(RedisConnector.name, new RedisConnector());
        this.#dependencies.set(OrderActionService.name, new OrderActionService());
    }

    static get(name) {
        const dependency = this.#dependencies.get(name);
        if (!dependency) {
            throw new Error(`Dependency ${name} not found!`);
        }
        return dependency;
    }
}
