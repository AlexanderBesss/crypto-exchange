import EventEmitter from "node:events";
import { Server } from "socket.io";
import { ORDER_EVENT_NAME } from "../../order/service/order-service.js";

export class OrderBroadcastService {
    #wsServer;
    #eventEmitter;
     
    /**
     * @param {Server} wsServer 
     * @param {EventEmitter} eventEmitter 
     */
    constructor(wsServer, eventEmitter) {
        this.#wsServer = wsServer;
        this.#eventEmitter = eventEmitter;
        this.subscribeOnOrderEvent();
    }

    joinPair(bookId, socket){
        if (socket.currentPair) {
            socket.leave(socket.currentPair);
            console.log(`User ${socket.id} left ${socket.currentPair} pair.`);
        }
        socket.join(bookId);
        socket.currentPair = bookId;
        console.log(`User ${socket.id} joining ${bookId} pair.`);
    }

    subscribeOnOrderEvent(){
        this.#eventEmitter.on(ORDER_EVENT_NAME, (orderEvent) => {
            console.log('Receive order event: ', orderEvent);
            this.#wsServer.to(orderEvent.bookId).emit("updatesInBook", orderEvent);
        });
    }
}
