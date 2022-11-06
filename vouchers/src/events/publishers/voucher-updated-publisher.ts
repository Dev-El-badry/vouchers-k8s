import { Publisher, Subjects, VoucherUpdatedEvent } from "@dev0vouchers/common";
export class VoucherUpdatedPublisher extends Publisher<VoucherUpdatedEvent> {
  subject: Subjects.VoucherUpdated = Subjects.VoucherUpdated;
}
