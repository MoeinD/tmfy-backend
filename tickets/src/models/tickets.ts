import mongoose from 'mongoose';
//this inteface is for hte ticket before saving
interface TicketAttrs {
    title: string;
    price: string;
    userId: string
}

/**
 * this inteface for the ticket after has
 * been created by mongoose and added 
 * some extra prop in it
 */
interface TicketDoc extends mongoose.Document {
    title: string;
    price: number;
    userId: string;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): TicketDoc
}

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    userId: {
        type: String,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
})

ticketSchema.statics.build = (attr: TicketAttrs) => {
    return new Ticket(attr);
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };