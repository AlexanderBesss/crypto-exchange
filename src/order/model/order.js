export class Order {
    /**
     * @param {string} orderId
     * @param {string} bookId
     * @param {Number} price 
     * @param {Number} amount
     * @param {'bid' | 'ask'} type
     * @param {'open' | 'closed' | 'cancelled'} status
     */
    constructor(orderId, bookId, price, amount, type, status = "open") {
        this.orderId = orderId;
        this.bookId = bookId;
        this.price = price;
        this.amount = amount;
        this.type = type;
        this.status = status;
    }
}

export class SellOrderInput {
    /**
     * @param {string} bookId 
     * @param {Number} price 
     * @param {Number} amount 
     */
    constructor(bookId, price, amount) {
        this.bookId = bookId;
        this.price = price;
        this.amount = amount;
    }
}
