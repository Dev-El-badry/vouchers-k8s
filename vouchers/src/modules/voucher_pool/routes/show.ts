import { NotFoundError, requireAuth } from "@dev0vouchers/common";
import express from "express";
import { VoucherPool } from "../models/voucher-pool";

const router = express.Router();

router.get("/:id", requireAuth, async (req: any, res: any) => {
  const voucherPool = await VoucherPool.findById(req.params.id).populate({
    path: "vouchers",
  });

  if (!voucherPool) {
    throw new NotFoundError();
  }

  res.send(voucherPool);
});

export { router as showVoucherPoolRouter };
