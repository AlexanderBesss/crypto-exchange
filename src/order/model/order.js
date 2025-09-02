import Decimal from "decimal.js";

export class Order {
    #orderId;
    #orderBookId;
    #leftCurrency;
    #rightCurrency;
    #price;
    #amount;
    #type;
    #status;

    /**
     * @param {string} orderId
     * @param {string} orderBookId
     * @param {string} leftCurrency 
     * @param {string} rightCurrency 
     * @param {Decimal} price 
     * @param {Decimal} amount 
     * @param {'bid' | 'ask'} type
     * @param {'open' | 'closed' | 'cancelled'} status
     */
    constructor(orderId,orderBookId, leftCurrency, rightCurrency, price, amount, type, status = "open") {
        this.#orderId = orderId;
        this.#orderBookId = orderBookId;
        this.#leftCurrency = leftCurrency;
        this.#rightCurrency = rightCurrency;
        this.#price = price;
        this.#amount = amount;
        this.#type = type;
        this.#status = status;
    }
}
