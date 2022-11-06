import mongoose from "mongoose";
import { Redeem } from "./redeem";

interface VoucherAttrs {
  id: string;
  code: string;
  amount: number;
  expireAt: Date;
}

export interface VoucherDoc extends mongoose.Document {
  code: string;
  amount: number;
  expireAt: Date;
  isExpire(): Promise<boolean>;
  isUsed(userId: string): Promise<boolean>;
}

interface VoucherModel extends mongoose.Model<VoucherDoc> {
  build(attrs: VoucherAttrs): VoucherDoc;
}

const voucherSchema = new mongoose.Schema(
  {
    code: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    expireAt: {
      type: Date,
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

voucherSchema.index({ code: 1 });
voucherSchema.statics.build = (attrs: VoucherAttrs) => {
  return new Voucher(attrs);
};

voucherSchema.methods.isExpire = async function () {
  const now = new Date();
  return this.get("expireAt") < now;
};

voucherSchema.methods.isUsed = async function (userId) {
  const isUsed = await Redeem.findOne({
    //@ts-ignore
    voucher: this,
    userId: userId,
  });
  return !!isUsed;
};

const Voucher = mongoose.model<VoucherDoc, VoucherModel>(
  "Voucher",
  voucherSchema
);

export { Voucher };
