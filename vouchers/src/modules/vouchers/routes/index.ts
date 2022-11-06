import { requireAuth } from "@dev0vouchers/common";
import express from "express";
import { Voucher } from "../models/voucher";

const router = express.Router();

router.get("/", requireAuth, async (req: any, res: any) => {
  const { voucher_pool_id } = req.query;

  const vouchers = await Voucher.find(
    voucher_pool_id ? { voucherPool: voucher_pool_id } : {}
  );

  res.status(201).send(vouchers);
});

export { router as indexVoucherRouter };
