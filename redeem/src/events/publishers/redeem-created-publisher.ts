import { Publisher, RedeemCreatedEvent, Subjects } from "@dev0vouchers/common";

export class RedeemCreatedPublisher extends Publisher<RedeemCreatedEvent> {
  subject: Subjects.RedeemCreated = Subjects.RedeemCreated;
}
