import EventEmitter from "node:events";
import { WebSocket } from "ws";
import { ORDER_EVENT_NAME } from "../../order/service/order-service.js";

export class OrderBroadcastService {
    #wsServer;
    #eventEmitter;
     
    /**
     * @param {WebSocket} wsServer 
     * @param {EventEmitter} eventEmitter 
     */
    constructor(wsServer, eventEmitter) {
        this.#wsServer = wsServer;
        this.#eventEmitter = eventEmitter;
        this.subscribeOnOrderEvent();
    }

    joinPair(wsClient){
        console.log(`User ${wsClient.id} joining pair...`);
    }

    leavePair(wsClient){
        console.log(`User ${wsClient.id} leaving pair...`);
    }

    subscribeOnOrderEvent(){
        this.#eventEmitter.on(ORDER_EVENT_NAME, (orderEvent) => {
            console.log('Receive order event: ', orderEvent)
        });
    }
}
