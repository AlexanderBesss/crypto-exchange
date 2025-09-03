import { RedisConnector } from "../src/resource/redis-connector.js";

const books = new Map([
    [
        "book:1", {
            bookId: "book:1",
            pair: "BTC-USD",
            name: "Bitcoin to US Dollar"
        }
    ],
    [
       "book:2",{
            bookId: "book:2",
            pair: "ETH-USD",
            name: "Ethereum to US Dollar"
       }
    ],
    [
        "book:3", {
            bookId: "book:3",
            pair: "LTC-USD",
            name: "Litecoin to US Dollar"
        }
    ],
    [
        "book:4", {
            bookId: "book:4",
            pair: "XRP-USD",
            name: "Ripple to US Dollar"
        }
    ],
    [
        "book:5", {
            bookId: "book:5",
            pair: "BCH-USD",
            name: "Bitcoin Cash to US Dollar"
        }
    ]
]);

const orders = new Map([
    [ 
        "order:1", {
            orderId: "order:1",
            bookId: "book:1",
            type: "bid",
            amount: 5,
            price: 30000,
            status: "open",
        }
    ],
    [ 
        "order:11", {
            orderId: "order:11",
            bookId: "book:1",
            type: "bid",
            amount: 4,
            price: 29000,
            status: "open",
        }
    ],
    [ 
        "order:12", {
            orderId: "order:12",
            bookId: "book:1",
            type: "bid",
            amount: 6,
            price: 31000,
            status: "open",
        }
    ],
    [
        "order:2", {
            orderId: "order:2",
            bookId: "book:1",
            type: "ask",
            amount: 2,
            price: 32000,
            status: "open",
        }
    ],
    [
        "order:21", {
            orderId: "order:21",
            bookId: "book:1",
            type: "ask",
            amount: 1,
            price: 31500,
            status: "open",
        }
    ],
    [
        "order:22", {
            orderId: "order:22",
            bookId: "book:1",
            type: "ask",
            amount: 2,
            price: 31800,
            status: "open",
        }
    ],
    [
        "order:3", {
            orderId: "order:3",
            bookId: "book:2",
            type: "bid",
            amount: 10,
            price: 150,
            status: "open",
        }
    ],
    [
        "order:4", {
            orderId: "order:4",
            bookId: "book:2",
            type: "ask",
            amount: 1000,
            price: 174,
            status: "open",
        }
    ],
    [
        "order:5", {
            orderId: "order:5",
            bookId: "book:3",
            type: "bid",
            amount: 100,
            price: 1500,
            status: "open",
        }
    ],
    [
        "order:6", {
            orderId: "order:6",
            bookId: "book:3",
            type: "ask",
            amount: 123,
            price: 1749,
            status: "open",
        }
    ],
    [
        "order:7", {
            orderId: "order:7",
            bookId: "book:4",
            type: "bid",
            amount: 10,
            price: 1540,
            status: "open",
        }
    ],
    [
        "order:8", {
            orderId: "order:8",
            bookId: "book:4",
            type: "ask",
            amount: 1000,
            price: 1632,
            status: "open",
        }
    ],
    [
        "order:9", {
            orderId: "order:9",
            bookId: "book:5",
            type: "bid",
            amount: 10,
            price: 1050,
            status: "open",
        }
    ],
    [
        "order:10", {
            orderId: "order:10",
            bookId: "book:5",
            type: "ask",
            amount: 23,
            price: 1083,
            status: "open",
        }
    ],
]);

const orderBooksRelation = new Map([
    ["orderBook:1", ["order:1", "order:2", "order:11", "order:12", "order:21", "order:22",]],
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

    for (const [key, ordersInBook] of orderBooksRelation.entries()) {
        for (const orderInBook of ordersInBook){
            await redisClient.zAdd(key, {
                score: orders.get(orderInBook).price,
                value: orderInBook,
            });
            console.log(`OrderBook with id ${key} inserted`);
        }
    }
    await redisClient.close();
}

seedDatabase().catch(console.error);
