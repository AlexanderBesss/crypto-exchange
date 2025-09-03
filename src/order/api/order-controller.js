import { BaseController } from "../../core/base-controller.js";
import { CreatedHttpResponse, NotFoundError, OkHttpResponse } from "../../core/response/http-response-type.js";
import { BookIdSchema, OrderIdSchema, SellOrderSchema } from "../model/validation/order-schema.js";
import { OrderService } from "../service/order-service.js";

export class OrderController extends BaseController {
    /**
     * @param {OrderService} orderService 
     */
    constructor(orderService) {
        super();
        this.orderService = orderService;
    }

    async processActions(req, res) {
        const url = req.url;
        const httpMethod = req.method;
         if(/^\/orders\/book:/.test(url) && this.ordersGET.name.includes(httpMethod)){
            return this.ordersGET(req);
        }
        if(/buy/.test(url) && this.buyPOST.name.includes(httpMethod)){
            return this.buyPOST(req);
        }
        if(/sell/.test(url) && this.sellPOST.name.includes(httpMethod)){
            return this.sellPOST(req);
        }
        if(/cancel/.test(url) && this.cancelDELETE.name.includes(httpMethod)){
            return this.cancelDELETE(req);
        }
        throw new NotFoundError("Order action not found!");
    }

    async ordersGET(req){
        const bookId = this.getParam(req.url);
        this.validate(BookIdSchema, { bookId });
        const orders = await this.orderService.getOrdersByBook(bookId);
        return new OkHttpResponse(orders);
    }

    async buyPOST(req) {
        const orderId = this.getParam(req.url);
        this.validate(OrderIdSchema, { orderId });
        const order = await this.orderService.buyOrder(orderId);
        return new CreatedHttpResponse(order);
    }

    async sellPOST(req) {
        const body = await this.getBody(req);
        this.validate(SellOrderSchema, body);
        const order = await this.orderService.sellOrder(body);
        return new CreatedHttpResponse(order);
    }

    async cancelDELETE(req) {
        const orderId = this.getParam(req.url);
        this.validate(OrderIdSchema, { orderId });
        const cancelledOrder = await this.orderService.cancelOrder(orderId);
        return new OkHttpResponse(cancelledOrder);
    }
}
