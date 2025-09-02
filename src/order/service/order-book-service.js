import { WebSocket } from "ws";

export class OrderBookService {
    #wsServer;
     
    /**
     * @param {WebSocket} wsServer 
     */
    constructor(wsServer) {
        this.#wsServer = wsServer;
    }

    joinPair(wsClient){
        console.log(`User ${wsClient.id} joining pair...`);
    }

    leavePair(wsClient){
        console.log(`User ${wsClient.id} leaving pair...`);
    }
}
