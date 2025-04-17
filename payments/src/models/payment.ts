import mongoose from 'mongoose';

interface sentPaymentAttrs {
  orderId: string;
  stripId: string;
}
interface retrievedPaymentDoc extends mongoose.Document {
  orderId: string;
  stripId: string;
}
interface paymentModel extends mongoose.Model<retrievedPaymentDoc> {
  build(attrs: sentPaymentAttrs): retrievedPaymentDoc;
}

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      require: true,
    },
    stripeId: {
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

paymentSchema.statics.build = (attrs: sentPaymentAttrs) => {
  return new Payment(attrs);
};
const Payment = mongoose.model<retrievedPaymentDoc, paymentModel>(
  'payment',
  paymentSchema
);

export default Payment;
