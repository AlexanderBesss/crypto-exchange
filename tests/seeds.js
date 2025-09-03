import { RedisConnector } from "../src/resource/redis-connector.js";

const books = new Map([
    [
        "book:1", {
            pair: "BTC-USD",
            name: "Bitcoin to US Dollar"
        }
    ],
    [
       "book:2",{
            pair: "ETH-USD",
            name: "Ethereum to US Dollar"
       }
    ],
    [
        "book:3", {
            pair: "LTC-USD",
            name: "Litecoin to US Dollar"
        }
    ],
    [
        "book:4", {
            pair: "XRP-USD",
            name: "Ripple to US Dollar"
        }
    ],
    [
        "book:5", {
            pair: "BCH-USD",
            name: "Bitcoin Cash to US Dollar"
        }
    ]
]);

const orders = new Map([
    [ 
        "order:1", {
            bookId: 1,
            type: "bid",
            amount: 0.5,
            price: 30000,
            status: "open",
        }
    ],
    [
        "order:2", {
            bookId: 1,
            type: "ask",
            amount: 2,
            price: 2000,
            status: "open",
        }
    ],
    [
        "order:3", {
            bookId: 2,
            type: "bid",
            amount: 10,
            price: 150,
            status: "open",
        }
    ],
    [
        "order:4", {
            bookId: 2,
            type: "ask",
            amount: 1000,
            price: 0.5,
            status: "open",
        }
    ],
    [
        "order:5", {
            bookId: 3,
            type: "bid",
            amount: 10,
            price: 150,
            status: "open",
        }
    ],
    [
        "order:6", {
            bookId: 3,
            type: "ask",
            amount: 1000,
            price: 0.5,
            status: "open",
        }
    ],
    [
        "order:7", {
            bookId: 4,
            type: "bid",
            amount: 10,
            price: 150,
            status: "open",
        }
    ],
    [
        "order:8", {
            bookId: 4,
            type: "ask",
            amount: 1000,
            price: 0.5,
            status: "open",
        }
    ],
    [
        "order:9", {
            bookId: 5,
            type: "bid",
            amount: 10,
            price: 150,
            status: "open",
        }
    ],
    [
        "order:10", {
            bookId: 5,
            type: "ask",
            amount: 1000,
            price: 0.5,
            status: "open",
        }
    ],
]);

const orderBooksRelation = new Map([
    ["orderBook:1", ["order:1", "order:2"]],
    ["orderBook:2", ["order:3", "order:4"]],
    ["orderBook:3", ["order:5", "order:6"]],
    ["orderBook:4", ["order:7", "order:8"]],
    ["orderBook:5", ["order:9", "order:10"]],
]);

async function seedDatabase() {
    const redisConnector = new RedisConnector();
    const redisClient = await redisConnector.getClient();

    for (const [key, book] of books.entries()) {
        await redisClient.hSet(key, book);
        console.log(`Book with id ${key} inserted.`);
    }
    
    for (const [key, order] of orders.entries()) {
        await redisClient.hSet(key, order);
        console.log(`Order with id ${key} inserted.`);
    }

    for (const [key, orderBook] of orderBooksRelation.entries()) {
        await redisClient.sAdd(key, orderBook);
        console.log(`OrderBook with id ${key} inserted`);
    }
    await redisClient.close();
}

seedDatabase().catch(console.error);
