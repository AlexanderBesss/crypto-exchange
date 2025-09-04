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
            if(body === ''){
                return;
            }
            const parsedBody = JSON.parse(body);
            return parsedBody;
        }
    }

    async getBody(req) {
        const body = await this.#parseBody(req);
        return body;
    }

    validate(schema, data){
        try {
            const validData = schema.parse(data);
            console.log("Data is valid: ", data);
            return validData;
        } catch (error) {
            const errors = JSON.parse(error.message);
            const errorMessages = `Property "${errors[0].path[0]}" ${errors[0].message}`;
            throw new BadRequestError(errorMessages);
        }
    }

    /**
     * 
     * @param {String} url 
     */
    getParam(url){
        const paramWithQuery = url.split('/').at(-1);
        const param = paramWithQuery.split('?').at(0);
        return param;
    }
}
