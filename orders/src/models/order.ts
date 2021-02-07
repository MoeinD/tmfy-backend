import mongoose from 'mongoose';

/**this isthe property that we need to create the order 
 * so it is before mongoose
 */
interface OrderAttrs {
    userId: string;
    status: string;
    expiresAt: Date;
    ticket: TicketDoc;
}

/**this is the interface that we need when return back the 
 * mongoose result after adding the item to them mongoose.
 */
interface OrderDoc extends mongoose.Document {
    userId: string;
    status: string;
    expiresAt: Date;
    ticket: TicketDoc;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
}
)

orderSchema.statics.build = (attrs: OrderAttrs) => {
    return new Order(attrs);
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };