import {
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@dev0vouchers/common";
import express from "express";
import { body } from "express-validator";
import { VoucherPool } from "../models/voucher-pool";

const router = express.Router();

router.put(
  "/:id",
  requireAuth,
  [body("title").notEmpty().withMessage("title not be empty")],
  validateRequest,
  async (req: any, res: any) => {
    const { title } = req.body;

    const voucherPool = await VoucherPool.findById(req.params.id);
    if (!voucherPool) {
      throw new NotFoundError();
    }

    voucherPool.set({
      title,
    });
    await voucherPool.save();

    res.status(201).send(voucherPool);
  }
);

export { router as updateVoucherPoolRouter };
