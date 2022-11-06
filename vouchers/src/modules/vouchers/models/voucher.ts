import { randomBytes } from "crypto";

import mongoose from "mongoose";

interface VoucherAttrs {
  amount: number;
  userId: string;
  expireAt: Date;
  voucherPool: string;
}

interface VoucherDoc extends mongoose.Document {
  code: string;
  amount: number;
  userId: string;
  expireAt: Date;
  voucherPool: string;
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
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    userId: {
      type: String,
      required: true,
    },
    voucherPool: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VoucherPool",
      required: true,
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

voucherSchema.pre("save", function (next) {
  const code = randomBytes(4).toString("hex").toUpperCase();
  this.set("code", code);

  next();
});

const Voucher = mongoose.model<VoucherDoc, VoucherModel>(
  "Voucher",
  voucherSchema
);

export { Voucher };
