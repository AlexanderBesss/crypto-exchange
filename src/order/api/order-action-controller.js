import { BaseController } from "../../core/base-controller.js";
import { CreatedHttpResponse, NotFoundError } from "../../core/response/http-response-type.js";
import { BuyOrderSchema } from "../model/validation/order-schema.js";

export class OrderActionController extends BaseController {
    constructor(orderService) {
        super();
        this.orderService = orderService;
    }

    async processActions(req, res) {
        const url = req.url;
        const httpMethod = req.method;
        if(/buy/.test(url) && this.buyPOST.name.includes(httpMethod)){
            return this.buyPOST(req);
        }
        if(/buy/.test(url) && this.buyGET.name.includes(httpMethod)){
            return this.buyGET(req);
        }
        if(/sell/.test(url) && this.sellPOST.name.includes(httpMethod)){
            return this.sellPOST(res);
        }
        if(/cancel/.test(url) && this.cancelPOST.name.includes(httpMethod)){
            return this.cancelPOST(res); 
        }
        throw new NotFoundError("Order action not found!");
    }

    async buyPOST(req) {
        const body = await this.getBody(BuyOrderSchema, req);
        return new CreatedHttpResponse(body);
    }

    async buyGET(req) {
         const body = await this.parseBody(req);
         return new CreatedHttpResponse({ message: "Buy GET action created" });
    }

    async sellPOST(body, res) {
        return new CreatedHttpResponse({ message: "Order has been sold!" });
    }

    async cancelPOST(body, res) {
        return new CreatedHttpResponse({ message: "Order has been cancelled!" });
    }
}
