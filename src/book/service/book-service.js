import { Book } from "../model/book.js";
import { BookRepository } from "../repository/book-repository.js";

export class BookService {
    #bookRepository;
    /**
    * @param {BookRepository} bookRepository 
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
