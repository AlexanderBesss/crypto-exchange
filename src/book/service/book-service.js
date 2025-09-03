import { Book } from "../model/book.js";
import { BookRedisRepository } from "../repository/book-redis-repository.js";

export class BookService {
    #bookRepository;
    /**
    * @param {BookRedisRepository} bookRepository 
    */
    constructor(bookRepository) {
        this.#bookRepository = bookRepository;
    }

    /**
     * @returns {Promise<Book[]>}
     */
    async getAllBooks(){
        return await this.#bookRepository.getAllBooks();
    }
}
