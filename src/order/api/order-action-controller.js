import { BaseController } from "../../core/base-controller.js";

export class OrderActionController extends BaseController {
    constructor(orderService) {
        super();
        this.orderService = orderService;
    }

    process(req, res) {
        const url = req.url;
        const httpMethod = req.method;
        if(/buy/.test(url) && this.buyPOST.name.includes(httpMethod)){
            this.buyPOST(res);
            return;
        }
        if(/buy/.test(url) && this.buyGET.name.includes(httpMethod)){
            this.buyGET(res);
            return;
        }
        if(/sell/.test(url) && this.sellPOST.name.includes(httpMethod)){
            this.sell(res);
            return;
        }
        if(/cancel/.test(url) && this.cancelPOST.name.includes(httpMethod)){
            this.cancel(res);
            return;
        }
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Unknown order action\n");
        return;
    }

    async buyPOST(body, res) {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Buy POST action\n");
    }

    async buyGET(body, res) {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Buy GET action\n");
    }

    async sellPOST(body, res) {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Buy action\n");
    }

    async cancelPOST(body, res) {
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("Buy action\n");
    }
}
