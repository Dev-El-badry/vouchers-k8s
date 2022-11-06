import mongoose from "mongoose";

interface VoucherPoolAttrs {
  title: string;
  userId: string;
}

interface VoucherPoolDoc extends mongoose.Document {
  title: string;
  userId: string;
}

interface VoucherPoolModel extends mongoose.Model<VoucherPoolDoc> {
  build(attrs: VoucherPoolAttrs): VoucherPoolDoc;
}

const voucherPoolSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
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
      virtuals: true,
    },
    toObject: { virtuals: true },
  }
);

voucherPoolSchema.statics.build = (attrs: VoucherPoolAttrs) => {
  return new VoucherPool(attrs);
};

voucherPoolSchema.virtual("vouchers", {
  ref: "Voucher",
  foreignField: "voucherPool",
  localField: "_id",
});

const VoucherPool = mongoose.model<VoucherPoolDoc, VoucherPoolModel>(
  "VoucherPool",
  voucherPoolSchema
);

export { VoucherPool };
