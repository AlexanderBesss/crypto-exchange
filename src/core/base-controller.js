import { BadRequestError } from "./response/http-response-type.js";

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

    async #parseBody(req) {
        if(["POST", "PUT", "PATCH"].includes(req.method)){ 
            const body = await this.#getBody(req);
            const parsedBody = JSON.parse(body);
            return parsedBody;
        }
    }

    async getBody(schema, req) {
        const body = await this.#parseBody(req);
        try {
            const validatedBody = schema.parse(body);
            return validatedBody;
        } catch (error) {
            const errors = JSON.parse(error.message);
            const errorMessages = `Property "${errors[0].path[0]}" ${errors[0].message}`;
            throw new BadRequestError(errorMessages);
        }
    }
}
