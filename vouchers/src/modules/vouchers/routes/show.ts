import { NotFoundError, requireAuth } from "@dev0vouchers/common";
import express from "express";
import { Voucher } from "../models/voucher";

const router = express.Router();

router.get("/:id", requireAuth, async (req: any, res: any) => {
  const voucher = await Voucher.findById(req.params.id);
  if (!voucher) {
    throw new NotFoundError();
  }

  res.status(201).send(voucher);
});

export { router as showVoucherRouter };
