import { BaseController } from "../../core/base-controller.js";
import { NotFoundError, OkHttpResponse } from "../../core/response/http-response-type.js";

export class BookController extends BaseController {
    #bookService;
    constructor(bookService) {
        super();
        this.#bookService = bookService;
    }

    async processActions(req, res) {
        const url = req.url;
        const httpMethod = req.method;
        if(/^\/books$/.test(url) && this.booksGET.name.includes(httpMethod)){
            return this.booksGET(req);
        }
        throw new NotFoundError("Book action not found!");
    }

    async booksGET() {
        const books = await this.#bookService.getAllBooks();
        return new OkHttpResponse(books);
    }
}
