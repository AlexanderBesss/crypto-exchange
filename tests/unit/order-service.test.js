import { beforeEach, expect, jest } from '@jest/globals';
import { OrderService } from "../../src/order/service/order-service.js";
import { askOrder, bidOrder } from "./order-dataset.js";
import { ConflictError, NotFoundError } from '../../src/core/response/http-response-type.js';

describe('OrderService', ()=> {
    const orderRedisRepository = {
        createOrder: jest.fn(),
        findAllByBookId: jest.fn(),
        findOrderById: jest.fn(),
        deleteOrder: jest.fn(),
        findSimilarOrders: jest.fn(),
    };
    const orderEventEmitter = {
        emit: jest.fn(),
    };
    const orderService = new OrderService(orderRedisRepository, orderEventEmitter);

    beforeEach(()=>{
        jest.resetAllMocks();
    })

    describe('getOrdersByBook', () => {
        it('should return all orders ask in ascending and bid in descending order', async ()=> {
            const askOrderWithLowerPrice = {...askOrder, price: askOrder.price - 2};
            jest.spyOn(orderRedisRepository, 'findAllByBookId').mockImplementation((id) => {
                return [askOrderWithLowerPrice, bidOrder, askOrder ];
            });
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

            const result = await orderService.buyOrder(expectedOrder.orderId);

            expect(result).toMatchObject(expectedOrder);
            expect(deleteSpy).toHaveBeenCalledTimes(1);
            expect(eventEmitterSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('cancelOrder', () => {
        it('should throw NotFound error if order was not found', async ()=> {
            jest.spyOn(orderRedisRepository, 'findOrderById').mockImplementation(() => undefined);
            const expectedOrders = orderService.buyOrder('bookId');
            await expect(expectedOrders).rejects.toThrow(NotFoundError);
        });

        it('should cancel an order', async ()=> {
            jest.spyOn(orderRedisRepository, 'findOrderById').mockImplementation(() => askOrder);
            const deleteSpy = jest.spyOn(orderRedisRepository, 'deleteOrder').mockImplementationOnce((bookId, orderId)=>{
                expect(orderId).toEqual(askOrder.orderId);
                expect(bookId).toEqual(askOrder.bookId);
            });
            const expectedOrder = {
                ...askOrder,
                status: 'cancelled',
            }
            const eventEmitterSpy = jest.spyOn(orderEventEmitter, 'emit').mockImplementationOnce((name, event)=>{
                expect(event).toMatchObject(expectedOrder);
            });

            const result = await orderService.cancelOrder(expectedOrder.orderId);

            expect(result).toMatchObject(expectedOrder);
            expect(deleteSpy).toHaveBeenCalledTimes(1);
            expect(eventEmitterSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('sellOrder', () => {
        it('should sell order if it has similar price and amount', async ()=> {
            jest.spyOn(orderRedisRepository, 'findSimilarOrders').mockImplementation(() => [bidOrder]);
            const deleteSpy = jest.spyOn(orderRedisRepository, 'deleteOrder').mockImplementationOnce((bookId, orderId)=>{
                expect(orderId).toEqual(bidOrder.orderId);
                expect(bookId).toEqual(bidOrder.bookId);
            });
            const expectedOrder = {
                ...bidOrder,
                status: 'closed',
            }
            const eventEmitterSpy = jest.spyOn(orderEventEmitter, 'emit').mockImplementationOnce((name, event)=>{
                expect(event).toMatchObject(expectedOrder);
            });

            const orderInput = {
                bookId: bidOrder.bookId,
                price: bidOrder.price,
                amount: bidOrder.amount,
            }

            const result = await orderService.sellOrder(orderInput);

            expect(result).toMatchObject(expectedOrder);
            expect(deleteSpy).toHaveBeenCalledTimes(1);
            expect(eventEmitterSpy).toHaveBeenCalledTimes(1);
        });

        it('should create a new order with "bid" type', async ()=> {
            jest.spyOn(orderRedisRepository, 'findSimilarOrders').mockImplementation(() => []);
            jest.spyOn(orderRedisRepository, 'findAllByBookId').mockImplementation((id) => {
                return [bidOrder, askOrder ];
            });
            const eventEmitterSpy = jest.spyOn(orderEventEmitter, 'emit').mockImplementationOnce((name, event)=>{
                expect(event).toMatchObject(expectedOrder);
            });
            
            const orderInput = {
                bookId: bidOrder.bookId,
                price: bidOrder.price -1,
                amount: bidOrder.amount,
            }
            const expectedOrder = {
                ...bidOrder,
                ...orderInput,
                orderId: expect.any(String),
                status: 'open',
            }
            const createSpy = jest.spyOn(orderRedisRepository, 'createOrder').mockImplementation((order)=> {
                expect(order).toMatchObject(expectedOrder);
            });

            const result = await orderService.sellOrder(orderInput);

            expect(result).toMatchObject(expectedOrder);
            expect(eventEmitterSpy).toHaveBeenCalledTimes(1);
            expect(createSpy).toHaveBeenCalledTimes(1);
        });

        it('should create a new order with "ask" type', async ()=> {
            jest.spyOn(orderRedisRepository, 'findSimilarOrders').mockImplementation(() => []);
            jest.spyOn(orderRedisRepository, 'createOrder').mockImplementation();
            jest.spyOn(orderRedisRepository, 'findAllByBookId').mockImplementation((id) => {
                return [bidOrder, askOrder ];
            });
            jest.spyOn(orderEventEmitter, 'emit').mockImplementationOnce();
            
            const orderInput = {
                bookId: bidOrder.bookId,
                price: bidOrder.price + 1,
                amount: bidOrder.amount,
            }
            const expectedOrder = {
                ...bidOrder,
                ...orderInput,
                orderId: expect.any(String),
                type: 'ask',
                status: 'open',
            }

            const result = await orderService.sellOrder(orderInput);

            expect(result).toMatchObject(expectedOrder);
        });
    });
});
