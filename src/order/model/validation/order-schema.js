import * as zod from 'zod';

export const BuyOrderSchema = zod.object({
    orderId: zod.uuid(),
    price: zod.string(),
    amount: zod.number().min(0),
});
