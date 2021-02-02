import { Publisher, Subjects, TicketCreatedEvent } from "@tmfyticket/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;
}