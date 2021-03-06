import { Subjects } from "./subjects";

export interface PaymentCreatedEvent {
    subject: Subjects.paymentCreated;
    data: {
        id: string;
        orderId: string;
        stripeId: string;
    }
}