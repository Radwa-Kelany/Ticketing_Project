import mongoose from 'mongoose';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '../events/basics/orderStatus';
import { retrievedTicketDoc } from './ticket_model';

interface sentOrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: retrievedTicketDoc;
}
interface retrievedOrderDoc extends mongoose.Document {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: retrievedTicketDoc;
  version: number;
}
interface OderModel extends mongoose.Model<retrievedOrderDoc> {
  build(attrs: sentOrderAttrs): retrievedOrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created,
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
    },
    ticket: {
      type: mongoose.Schema.ObjectId ,
      ref: 'Ticket',
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (attrs: sentOrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<retrievedOrderDoc, OderModel>(
  'order',
  orderSchema
);

export default Order;
