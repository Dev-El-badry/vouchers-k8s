import { Listener, Subjects, VoucherCreatedEvent } from "@dev0vouchers/common";
import { Message } from "node-nats-streaming";
import { Voucher } from "../../models/voucher";
import { queueGroupName } from "./queue-group-name";

export class VoucherCreatedListener extends Listener<VoucherCreatedEvent> {
  subject: Subjects.VoucherCreated = Subjects.VoucherCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: VoucherCreatedEvent["data"], msg: Message) {
    const { id, code, amount, expireAt } = data;
    const voucher = Voucher.build({
      id,
      code,
      amount,
      expireAt,
    });
    await voucher.save();

    msg.ack();
  }
}
