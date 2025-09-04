import { BookController } from "../book/api/book-controller.js";
import { OrderController } from "../order/api/order-controller.js";
import { DependencyContainer } from "./dependency-container.js";
import { NotFoundError } from "./response/http-response-type.js";

export class HttpRouter {
    static get(path){
        switch(true){
            case /^\/orders/.test(path):
                return DependencyContainer.get(OrderController.name);
            case /^\/books$/.test(path):
                return DependencyContainer.get(BookController.name);
            default:
                throw new NotFoundError(`Page ${path} not found!`);
        }
    }   
}
