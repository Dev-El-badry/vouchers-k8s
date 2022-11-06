import mongoose from "mongoose";
import { VoucherDoc } from "./voucher";

interface RedeemAttrs {
  userId: string;
  voucher: VoucherDoc;
}

interface RedeemDoc extends mongoose.Document {
  userId: string;
  voucher: VoucherDoc;
}

interface RedeemModel extends mongoose.Model<RedeemDoc> {
  build(attrs: RedeemAttrs): RedeemDoc;
}

const redeemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    voucher: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Voucher",
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

redeemSchema.index({ code: 1 });
redeemSchema.statics.build = (attrs: RedeemAttrs) => {
  return new Redeem(attrs);
};

const Redeem = mongoose.model<RedeemDoc, RedeemModel>("Redeem", redeemSchema);

export { Redeem };
