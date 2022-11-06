import {
  BadRequestError,
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@dev0vouchers/common";
import express from "express";
import { body } from "express-validator";
import { RedeemCreatedPublisher } from "../events/publishers/redeem-created-publisher";
import { Redeem } from "../models/redeem";
import { Voucher } from "../models/voucher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  [body("code").notEmpty().withMessage("code not be empty")],
  validateRequest,
  async (req: any, res: any) => {
    const { code } = req.body;

    const voucher = await Voucher.findOne({ code });
    if (!voucher) {
      throw new NotFoundError();
    }

    const isExpire = await voucher.isExpire();
    if (isExpire) {
      throw new BadRequestError("voucher is expired");
    }

    const isUsed = await voucher.isUsed(req.currentUser.id);
    if (isUsed) {
      throw new BadRequestError("voucher is already used");
    }

    const redeem = Redeem.build({
      userId: req.currentUser.id,
      voucher,
    });

    await redeem.save();

    new RedeemCreatedPublisher(natsWrapper.client).publish({
      id: redeem.id,
      userId: redeem.userId,
      voucher: {
        id: voucher.id,
        amount: voucher.amount,
      },
    });

    res.status(201).send(redeem);
  }
);

export { router as createRedeemRouter };
