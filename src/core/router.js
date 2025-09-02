import { OrderActionController } from "../order/api/order-action-controller.js";
import { DependencyContainer } from "./dependency-container.js";

export class Router {
    static get(path){
        switch(true){
            case "/":
                return "main page";
            case /^\/order/.test(path):
                return DependencyContainer.get(OrderActionController.name);
            default:
                return `Page ${path} not found!`;
        }
    }   
}
