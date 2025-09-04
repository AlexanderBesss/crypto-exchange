import { expect, jest } from '@jest/globals';
import { OrderService } from "../../src/order/service/order-service.js";
import { askOrder, bidOrder } from "./order-dataset.js";
import { ConflictError, NotFoundError } from '../../src/core/response/http-response-type.js';

describe('OrderService', ()=> {
    const orderRedisRepository = {
        findAllByBookId: jest.fn(),
        findOrderById: jest.fn(),
        deleteOrder: jest.fn(),
    };
    const orderEventEmitter = {
        emit: jest.fn(),
    };
    const orderService = new OrderService(orderRedisRepository, orderEventEmitter);

    describe('getOrdersByBook', () => {
        it('should return all orders ask in ascending and bid in descending order', async ()=> {
            const askOrderWithLowerPrice = {...askOrder, price: askOrder.price - 2};
            jest.spyOn(orderRedisRepository, 'findAllByBookId').mockImplementation((id) => {
                return [askOrderWithLowerPrice, bidOrder, askOrder ];
            })
            const expectedOrders = await orderService.getOrdersByBook('bookId');
            expect(expectedOrders).toMatchObject({ask: [askOrderWithLowerPrice, askOrder ], bid: [bidOrder]});
        });
    });

    describe('buyOrder', () => {
        it('should throw NotFound error if order was not found', async ()=> {
            jest.spyOn(orderRedisRepository, 'findOrderById').mockImplementation(() => undefined);
            const expectedOrders = orderService.buyOrder('bookId');
            await expect(expectedOrders).rejects.toThrow(NotFoundError);
        });

        it('should throw Conflict error if order has bid type', async ()=> {
            jest.spyOn(orderRedisRepository, 'findOrderById').mockImplementation(() => bidOrder);
            const expectedOrders = orderService.buyOrder('bookId');
            await expect(expectedOrders).rejects.toThrow(ConflictError);
        });

        it('should buy an order', async ()=> {
            jest.spyOn(orderRedisRepository, 'findOrderById').mockImplementation(() => askOrder);
            const deleteSpy = jest.spyOn(orderRedisRepository, 'deleteOrder').mockImplementationOnce((bookId, orderId)=>{
                expect(orderId).toEqual(askOrder.orderId);
                expect(bookId).toEqual(askOrder.bookId);
            });
            const expectedOrder = {
                ...askOrder,
                status: 'closed',
            }
            const eventEmitterSpy = jest.spyOn(orderEventEmitter, 'emit').mockImplementationOnce((name, event)=>{
                expect(event).toMatchObject(expectedOrder);
            });

            const result = await orderService.buyOrder('bookId');

            expect(result).toMatchObject(expectedOrder);
            expect(deleteSpy).toHaveBeenCalledTimes(1);
            expect(eventEmitterSpy).toHaveBeenCalledTimes(1);
        });
    })
});
