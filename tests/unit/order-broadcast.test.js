import { beforeEach, expect, jest } from '@jest/globals';
import { OrderBroadcastService } from '../../src/broadcast/service/order-broadcast-service.js';

describe('OrderBroadcastService', ()=> {
    const orderEventEmitter = {
        emit: jest.fn(),
        on: jest.fn(),
    };
    const testSocket = {
        leave: jest.fn(),
        join: jest.fn(),
    }
    const orderBroadcastService = new OrderBroadcastService({}, orderEventEmitter);

    beforeEach(()=>{
        jest.resetAllMocks();
    })

    describe('joinPair', () => {
        it('should join a pair for the first time', async ()=> {
            const testBookId = 'bookId';
            const leaveSpy = jest.spyOn(testSocket, 'leave').mockImplementation();
            const joinSpy = jest.spyOn(testSocket, 'join').mockImplementation((bookId)=>
                expect(bookId).toEqual(testBookId),
            );
            
            orderBroadcastService.joinPair(testBookId, testSocket);

            expect(joinSpy).toHaveBeenCalledTimes(1);
            expect(leaveSpy).toHaveBeenCalledTimes(0);
        });

        it('should join a pair and leave previous', async ()=> {
            const testBookId = 'book:1';
            const previousBookId = 'book:2';
            const leaveSpy = jest.spyOn(testSocket, 'leave').mockImplementation((bookId)=>
                expect(bookId).toEqual(previousBookId),
            );
            const joinSpy = jest.spyOn(testSocket, 'join').mockImplementation((bookId)=>
                expect(bookId).toEqual(testBookId),
            );
            
            orderBroadcastService.joinPair(testBookId, {...testSocket, currentPair: previousBookId});

            expect(joinSpy).toHaveBeenCalledTimes(1);
            expect(leaveSpy).toHaveBeenCalledTimes(1);
        });
    });
});
