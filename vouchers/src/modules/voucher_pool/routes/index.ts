import { requireAuth } from "@dev0vouchers/common";
import express from "express";
import { VoucherPool } from "../models/voucher-pool";

const router = express.Router();

router.get("/", requireAuth, async (req: any, res: any) => {
  const pools = await VoucherPool.find({});
  res.send(pools);
});

export { router as indexVoucherPoolRouter };
