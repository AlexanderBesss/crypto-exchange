import { BaseController } from "../../core/base-controller.js";
import { CreatedHttpResponse, NotFoundError } from "../../core/response/http-response-type.js";

export class OrderActionController extends BaseController {
    constructor(orderService) {
        super();
        this.orderService = orderService;
    }

    async process(req, res) {
        const url = req.url;
        const httpMethod = req.method;
        if(/buy/.test(url) && this.buyPOST.name.includes(httpMethod)){
            return this.buyPOST(res);
        }
        if(/buy/.test(url) && this.buyGET.name.includes(httpMethod)){
            return this.buyGET(res);
        }
        if(/sell/.test(url) && this.sellPOST.name.includes(httpMethod)){
            return this.sellPOST(res);
        }
        if(/cancel/.test(url) && this.cancelPOST.name.includes(httpMethod)){
            return this.cancelPOST(res); 
        }
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Unknown order action\n");
        return;
    }

    async buyPOST(body, res) {
        throw new NotFoundError("Order not found!");
    }

    async buyGET(body, res) {
         return new CreatedHttpResponse({ message: "Buy GET action created" });
    }

    async sellPOST(body, res) {
        return new CreatedHttpResponse({ message: "Order has been sold!" });
    }

    async cancelPOST(body, res) {
        return new CreatedHttpResponse({ message: "Order has been cancelled!" });
    }
}
