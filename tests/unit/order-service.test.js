import { expect, jest } from '@jest/globals';
import { OrderService } from "../../src/order/service/order-service.js";
import { askOrder, bidOrder } from "./order-dataset.js";

describe('OrderService', ()=> {
    const orderRedisRepository = {
        findAllByBookId: jest.fn(),
    };
    const orderEventEmitter = {};
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
    })
});
