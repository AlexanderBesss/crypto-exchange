import { BookController } from "../book/api/book-controller.js";
import { OrderController } from "../order/api/order-controller.js";
import { DependencyContainer } from "./dependency-container.js";

export class HttpRouter {
    static get(path){
        switch(true){
            case "/":
                return "main page";
            case /^\/orders/.test(path):
                return DependencyContainer.get(OrderController.name);
            case /^\/books$/.test(path):
                return DependencyContainer.get(BookController.name);
            default:
                return `Page ${path} not found!`;
        }
    }   
}
