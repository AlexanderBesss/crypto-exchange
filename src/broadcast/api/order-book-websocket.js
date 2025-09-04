import { Server } from "socket.io";
import { OrderBroadcastService } from "../service/order-broadcast-service.js";

export class OrderBookWebSocket {
    #wsServer;
    #orderBookService;

    /**
     * @param {Server} wsServer
     * @param {OrderBroadcastService} orderBookService 
     */
    constructor(wsServer, orderBookService) {
        this.#orderBookService = orderBookService;
        this.#wsServer = wsServer;
        this.#wsServer.on("connection", (socket) => {
            console.log(`User ${socket.id} connected!`);
            socket.on("joinPair", (bookId) => {
                this.joinPair(bookId, socket);
            });

            socket.on("disconnect", () => {
                console.log(`User ${socket.id} disconnected!`);
            });
        });
    }

    joinPair(bookId, socket){
        this.#orderBookService.joinPair(bookId, socket);
    }
}
