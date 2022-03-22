import mongoose from 'mongoose';
import { Order, OrderStatus } from './Order';

interface TicketAttrs {
  title: string;
  price: number;
  id: string;
}
export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<Boolean>;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

const ticketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// add function on the Model
ticketSchema.statics.build = ({ id, price, title }: TicketAttrs) => {
  return new Ticket({ _id: id, price, title });
};

// add function on document
ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.Completed,
        OrderStatus.AwaitingPayment,
      ],
    },
  });
  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };
