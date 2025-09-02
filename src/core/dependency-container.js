import { OrderActionController } from "../order/api/order-action-controller.js";
import { OrderActionService } from "../order/service/order-action-service.js";
import { RedisConnector } from "../resource/redis-connector.js";

export class DependencyContainer {
    static #dependencies = new Map();
    constructor() {
        DependencyContainer.#register();
        console.log("Registered dependencies: ", DependencyContainer.#dependencies);
    }

    static #register() {
        // Register dependencies here (order matters)

        // Resources
        this.#dependencies.set(RedisConnector.name, new RedisConnector());

        // Services
        this.#dependencies.set(OrderActionService.name, new OrderActionService());

        // Controllers
        this.#dependencies.set(OrderActionController.name, new OrderActionController(this.get(OrderActionService.name)));
    }

    static get(name) {
        const dependency = this.#dependencies.get(name);
        if (!dependency) {
            throw new Error(`Dependency ${name} not found!`);
        }
        return dependency;
    }
}
