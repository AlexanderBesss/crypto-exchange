export class BaseController {
    constructor() {
        if (new.target === BaseController) {
            throw new Error("Cannot instantiate abstract class BaseController");
        }
    }

    processActions(req, res) {
        throw new Error("This method must be implemented.");
    }

    async #getBody(req) {
        const chunks = [];
        for await (const chunk of req) {
            chunks.push(chunk);
        }
        return Buffer.concat(chunks).toString();
    }

    async bodyParser(req) {
        if(["POST", "PUT", "PATCH"].includes(req.method)){ 
            const body = await this.#getBody(req);
            const parsedBody = JSON.parse(body);
            return parsedBody;
        }
    }
}
