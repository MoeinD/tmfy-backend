import { Subjects, Publisher, PaymentCreatedEvent } from "@tmfyticket/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{
    subject: Subjects.paymentCreated = Subjects.paymentCreated;

}