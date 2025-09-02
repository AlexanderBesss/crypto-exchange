import Decimal from "decimal.js";

export class Order {
    #leftCurrency;
    #rightCurrency;
    #price;
    #amount;
    #type; // bid/ask

    /**
     * @param {string} leftCurrency 
     * @param {string} rightCurrency 
     * @param {Decimal} price 
     * @param {Decimal} amount 
     * @param {string} type
     */
    constructor(leftCurrency, rightCurrency, price, amount, type) {
        this.leftCurrency = leftCurrency;
        this.rightCurrency = rightCurrency;
        this.price = price;
        this.amount = amount;
        this.type = type;
    }
}
