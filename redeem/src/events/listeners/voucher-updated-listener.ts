import { Listener, Subjects, VoucherUpdatedEvent } from "@dev0vouchers/common";
import { Message } from "node-nats-streaming";
import { Voucher } from "../../models/voucher";
import { queueGroupName } from "./queue-group-name";

export class VoucherUpdatedListener extends Listener<VoucherUpdatedEvent> {
  subject: Subjects.VoucherUpdated = Subjects.VoucherUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: VoucherUpdatedEvent["data"], msg: Message) {
    const { id, code, amount, expireAt } = data;

    const voucher = await Voucher.findById(id);
    if (!voucher) {
      throw new Error("voucher not found");
    }

    voucher.set({
      code,
      amount,
      expireAt,
    });
    await voucher.save();

    msg.ack();
  }
}
