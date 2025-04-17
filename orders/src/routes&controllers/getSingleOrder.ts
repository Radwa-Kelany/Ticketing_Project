import { Router, Request, Response } from 'express';
import { NotFoundError, NotAuthorizedError, requireAuth } from '@rktick/common';
import Order from '../models/order_model';
import Ticket from '../models/ticket_model';
import mongoose from 'mongoose';

const router = Router();

router.get('/:id', requireAuth, async (req: Request, res: Response) => {
  const order = await Order.aggregate([
    {
      $match: {
        _id:  new mongoose.Types.ObjectId( req.params.id)
      }
    },
    {
      $lookup: {
        from: 'tickets', 
        localField: 'ticket', 
        foreignField: '_id', 
        as: 'ticket', 
      },
    },
    {
      $unwind: '$ticket', 
    },
    {
      $project: {
        _id: 1,
        status: 1,
        expiresAt: 1,
        createdAt: 1,
        userId:1,
        'ticket.title': 1,
      },
    },
  ]);
  if (!order[0]) {
    throw new NotFoundError();
  }
  if (order[0].userId !== req.currentUser!.id) {
    throw new NotAuthorizedError();
  }
  res.status(200).send(order);
});

export { router as getSingleOrder };




// [orders] {
//   [orders]   _id: new ObjectId('67ff9c3dcdf4fef64af9734b'),
//   [orders]   userId: '67ff8a1d2c771e3de419f33c',
//   [orders]   status: 'created',
//   [orders]   expiresAt: 2025-04-16T12:17:05.591Z,
//   [orders]   ticket: new ObjectId('67ff9c39b3a15695a9bbca00'),
//   [orders]   version: 0
//   [orders] }