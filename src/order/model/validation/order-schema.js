import * as zod from 'zod';

export const OrderIdSchema = zod.object({
    orderId: zod.string(),
});

export const BookIdSchema = zod.object({
    bookId: zod.string(),
});

export const SellOrderSchema = zod.object({
    bookId: zod.string(),
    price: zod.number().min(0),
    amount: zod.number().min(0),
});
