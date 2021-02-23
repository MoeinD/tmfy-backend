import { Publisher, ExpirationCompleteEvent, Subjects } from "@tmfyticket/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}