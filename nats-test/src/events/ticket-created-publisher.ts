import { Publisher } from "./base-publisher";
import { TicketCreatedEvent } from './ticket-created-events';
import { Subjects } from './subjects';
import { Stan } from "node-nats-streaming";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent>{
    subject: Subjects.TicketCreated = Subjects.TicketCreated;

}


