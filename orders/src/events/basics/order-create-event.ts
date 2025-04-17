import { Subjects } from './subjects';
import { OrderStatus } from './orderStatus';

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    version: number;
    status: OrderStatus
    userId: string;
    expiresAt: string;
    ticket: {
      title: String,
      id: string;
      price: number;
      // isReserved: Promise<boolean>;
    };
  };
}
