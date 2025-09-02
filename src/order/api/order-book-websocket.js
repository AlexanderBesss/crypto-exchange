import { WebSocket } from "ws";
import { OrderBookService } from "../service/order-book-service.js";
import { randomUUID } from "crypto";

export class OrderBookWebSocket {
    #wsServer;
    #orderBookService;

    /**
     * @param {WebSocket} wsServer
     * @param {OrderBookService} orderBookService 
     */
    constructor(wsServer, orderBookService) {
        this.#orderBookService = orderBookService;
        this.#wsServer = wsServer;
        this.#wsServer.on("connection", (wsClient) => {
            wsClient.id = randomUUID();
            wsClient.on("message", (message) => {
                const parsedMessage = JSON.parse(message);
                if(parsedMessage.type === "joinPair"){
                    this.joinPair(wsClient);
                    wsClient.send(JSON.stringify({ message: `Successfully joined pair` }));
                }
            });

            wsClient.send(JSON.stringify({ message: "Welcome to the Order Book WebSocket!" }));
            wsClient.on('close', () => {
                this.leavePair(wsClient);
            });
        });
    }

    joinPair(wsClient){
        this.#orderBookService.joinPair(wsClient);
    }

    leavePair(wsClient){
        this.#orderBookService.leavePair(wsClient);
    }
}
