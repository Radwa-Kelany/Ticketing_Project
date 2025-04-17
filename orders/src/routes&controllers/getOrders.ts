import { Router, Request, Response } from 'express';
import { requireAuth } from '@rktick/common';
import Order from '../models/order_model';
import mongoose from 'mongoose';
import Ticket from '../models/ticket_model';
const router = Router();

router.get('/', requireAuth, async (req: Request, res: Response) => {
  const orders = await Order.aggregate([
    {
      $match: {
        userId: req.currentUser!.id,
      },
    },
    {
      $lookup: {
        from: 'tickets', // Collection name (lowercase plural)
        localField: 'ticket', // Field in orders collection
        foreignField: '_id', // Field in tickets collection
        as: 'ticket', // Output array field
      },
    },
    {
      $unwind: '$ticket', // Convert array to object
    },
    {
      $project: {
        _id: 1,
        status: 1,
        expiresAt: 1,
        createdAt: 1,
        'ticket.title': 1,
      },
    },
  ]);
  res.status(200).json(orders);
});

export { router as getAllOrders };
