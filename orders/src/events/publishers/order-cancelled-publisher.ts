import { Subjects, Publisher, OrderCancelledEvent } from '@tmfyticket/common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}