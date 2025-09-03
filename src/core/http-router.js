import { BookController } from "../book/api/book-controller.js";
import { OrderActionController } from "../order/api/order-action-controller.js";
import { DependencyContainer } from "./dependency-container.js";

export class HttpRouter {
    static get(path){
        switch(true){
            case "/":
                return "main page";
            case /^\/orders/.test(path):
                return DependencyContainer.get(OrderActionController.name);
            case /^\/books/.test(path):
                return DependencyContainer.get(BookController.name);
            default:
                return `Page ${path} not found!`;
        }
    }   
}
