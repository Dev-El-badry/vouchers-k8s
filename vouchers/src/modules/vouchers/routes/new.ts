import { requireAuth, validateRequest } from "@dev0vouchers/common";
import express from "express";
import { body } from "express-validator";
import { VoucherCreatedPublisher } from "../../../events/publishers/voucher-created-publisher";
import { natsWrapper } from "../../../nats-wrapper";
import { Voucher } from "../models/voucher";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  [
    body("amount")
      .isFloat({ gt: 0 })
      .withMessage("amount must be greater than 0"),
    body("voucher_pool_id")
      .notEmpty()
      .withMessage("voucher pool id not be empty"),
    body("expire_at").notEmpty().withMessage("expire not be empty"),
  ],
  validateRequest,
  async (req: any, res: any) => {
    const { amount, voucher_pool_id, expire_at } = req.body;

    const voucher = Voucher.build({
      amount,
      voucherPool: voucher_pool_id,
      expireAt: new Date(expire_at),
      userId: req.currentUser.id,
    });
    await voucher.save();

    new VoucherCreatedPublisher(natsWrapper.client).publish({
      id: voucher.id,
      code: voucher.code,
      amount: voucher.amount,
      expireAt: voucher.expireAt,
    });
    res.status(201).send(voucher);
  }
);

export { router as createVoucherRouter };
