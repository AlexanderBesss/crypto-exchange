export class BaseSuccessResponse {
    constructor(body, statusCode) {
        this.body = body;
        this.statusCode = statusCode;
    }
}

export class CreatedHttpResponse extends BaseSuccessResponse {
    constructor(body, statusCode = 201) {
        super(body, statusCode);
    }
}

export class OkHttpResponse extends BaseSuccessResponse  {
    constructor(body, statusCode = 200) {
        super(body, statusCode);
    }
}

export class NoContentHttpResponse extends BaseSuccessResponse  {
    constructor() {
        super('', 204);
    }
}

export class BaseErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        console.log("Error: ", message);
        this.statusCode = statusCode;
    }
}

export class NotFoundError extends BaseErrorResponse {
    constructor(message) {
        super(message, 404);
    }
}

export class BadRequestError extends BaseErrorResponse {
    constructor(message) {
        super(message, 400);
    }
}

export class InternalServerError extends BaseErrorResponse {
    constructor(message) {
        super(message, 500);
    }
}

export class DuplicateEntryError extends BaseErrorResponse {
    constructor(message) {
        super(message, 409);
    }
}
