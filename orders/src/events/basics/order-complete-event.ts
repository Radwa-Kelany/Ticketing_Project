import { Subjects } from './subjects';

export interface OrderCompleteEvent {
  subject: Subjects.OrderUpdated;
  data: {
    orderId: string;
    version: number;
  };
}
