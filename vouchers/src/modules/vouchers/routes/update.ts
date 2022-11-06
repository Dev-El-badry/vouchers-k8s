import {
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@dev0vouchers/common";
import express from "express";
import { body } from "express-validator";
import { VoucherUpdatedPublisher } from "../../../events/publishers/voucher-updated-publisher";
import { natsWrapper } from "../../../nats-wrapper";
import { Voucher } from "../models/voucher";

const router = express.Router();

router.put(
  "/:id",
  requireAuth,
  [
    body("amount")
      .isFloat({ gt: 0 })
      .withMessage("amount must be greater than 0"),
    body("expire_at").notEmpty().withMessage("expire not be empty"),
  ],
  validateRequest,
  async (req: any, res: any, next: any) => {
    const { amount, expire_at } = req.body;
    const voucher = await Voucher.findById(req.params.id);
    if (!voucher) {
      throw new NotFoundError();
    }

    await voucher.update({
      amount,
      expireAt: new Date(expire_at),
    });

    const voucherUpdated = await Voucher.findById(req.params.id);
    new VoucherUpdatedPublisher(natsWrapper.client).publish({
      id: voucherUpdated!.id,
      code: voucherUpdated!.code,
      amount: voucherUpdated!.amount,
      expireAt: voucherUpdated!.expireAt,
    });

    res.status(201).send(voucherUpdated);
  }
);

export { router as updateVoucherRouter };
