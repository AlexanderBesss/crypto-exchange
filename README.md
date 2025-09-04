# crypto-exchange

## Requirements
 - Node.js v22
 - Docker v28


 ## First Setup
 1. Install all dependencies: `npm install`
 2. Start Redis container: `docker compose up -d`
 3. Seed test data: `npm run seed`
 4. Start application: `npm start`


## List of endpoints
Http: ([Postman collection](./postman/HTTP-%20Crypto-exchange.postman_collection.json)):
 - GET `/orders/{bookId}` - List of orders in a book
 - DELETE `/orders/cancel/{orderId}` - Cancel an order
 - POST `/orders/buy/{orderId}` - Buy an order
 - POST `/orders/sell`
  body:  `{
    "bookId": "{bookId}",
    "amount": 100,
    "price": 5000
}` - Sell an order
 - GET `/books` - List of all available books.
 
 WebSockets (socket.io):
 - Event name: `joinPair`, message: `bookId` - Subscribe to a pair.
 - Event name: `updatesInBook` - Updates made in a book.
