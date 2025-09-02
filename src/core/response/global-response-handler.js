import { BaseErrorResponse, BaseSuccessResponse, InternalServerError } from "./http-response-type.js";

export class GlobalResponseHandler {
    static async handle(processRequestCallback, req, res){
        const defaultHeaders = { "Content-Type": "application/json" };
        try {
            const successResponse = await processRequestCallback(req, res);
            if (successResponse instanceof BaseSuccessResponse) {
                res.writeHead(successResponse.statusCode, defaultHeaders);
                res.end(JSON.stringify(successResponse.body));
            }

            // It prevents bad usage of Http errors
            if (successResponse instanceof BaseErrorResponse) {
                throw new InternalServerError("Internal server error!");
            }
        } catch (error) {
            if (error instanceof BaseErrorResponse) {
                res.writeHead(error.statusCode, defaultHeaders);
                res.end(JSON.stringify({ 
                    error: {
                        message: error.message, statusCode: error.statusCode 
                    }
                }));
            }
        }
    }
}
