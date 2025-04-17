import mongoose from 'mongoose';
import { OrderStatus } from '../events/basics/orderStatus';
import { updateIfCurrentPlugin } from 'mongoose-update-if-current';

interface sentOrderAttrs {
  id: string;
  status: string;
  userId: string;
  price: number;
  version: number;
}

interface retrievedOrderDoc extends mongoose.Document {
  status: OrderStatus;
  price: number;
  userId: string;
  version: number;
}

interface OrderModel extends mongoose.Model<retrievedOrderDoc> {
  build(attrs: sentOrderAttrs): retrievedOrderDoc;
}

const orderSchema = new mongoose.Schema(
  {
    price: {
      type: Number,
      require: true,
    },
    userId: {
      type: String,
      require: true,
    },
    status: {
      type: String,
      require: true,
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

orderSchema.statics.build = (attrs: sentOrderAttrs) => {
  return new Order({
    _id: attrs.id,
    price: attrs.price,
    userId: attrs.userId,
    status: attrs.status,
  });
};
orderSchema.set('versionKey', 'version');
orderSchema.plugin(updateIfCurrentPlugin);

const Order = mongoose.model<retrievedOrderDoc, OrderModel>(
  'order',
  orderSchema
);

export default Order;
