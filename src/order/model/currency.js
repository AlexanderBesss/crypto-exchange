export class Currency {
    #currencyId;
    #title;
    #tag;

    constructor(currencyId, title, tag) {
        this.#currencyId = currencyId;
        this.#title = title;
        this.#tag = tag;
    }
}
