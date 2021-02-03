import { Publisher, TicketUpdatedEvent, Subjects } from '@tmfyticket/common';

export class TicketUpdatePublisher extends Publisher<TicketUpdatedEvent> {
    subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}