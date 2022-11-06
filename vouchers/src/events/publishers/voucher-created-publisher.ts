import { Publisher, Subjects, VoucherCreatedEvent } from "@dev0vouchers/common";
export class VoucherCreatedPublisher extends Publisher<VoucherCreatedEvent> {
  subject: Subjects.VoucherCreated = Subjects.VoucherCreated;
}
