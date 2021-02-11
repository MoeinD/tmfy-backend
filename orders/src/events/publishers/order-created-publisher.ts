import { Publisher, OrderCreatedEvent, Subjects } from "@tmfyticket/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
}