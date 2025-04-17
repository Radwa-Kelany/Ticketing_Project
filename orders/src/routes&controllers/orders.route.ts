import { Router } from 'express';
import { createOrder } from './createOrder';
import { deleteOrder } from './deleteOrder';
import { getAllOrders } from './getOrders';
import { getSingleOrder } from './getSingleOrder';
const ordersRouter = Router();
ordersRouter .use('/', getAllOrders);
ordersRouter .use('/', getSingleOrder);
ordersRouter .use('/', createOrder);
ordersRouter .use('/', deleteOrder);

export default ordersRouter;
