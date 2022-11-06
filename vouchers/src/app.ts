import express, { Request, Response } from "express";
import "express-async-errors";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import { errorHandler, NotFoundError, currentUser } from "@dev0vouchers/common";
import { createVoucherPoolRouter } from "./modules/voucher_pool/routes/new";
import { updateVoucherPoolRouter } from "./modules/voucher_pool/routes/update";
import { showVoucherPoolRouter } from "./modules/voucher_pool/routes/show";
import { indexVoucherPoolRouter } from "./modules/voucher_pool/routes";
import { createVoucherRouter } from "./modules/vouchers/routes/new";
import { updateVoucherRouter } from "./modules/vouchers/routes/update";
import { showVoucherRouter } from "./modules/vouchers/routes/show";
import { indexVoucherRouter } from "./modules/vouchers/routes";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use(currentUser);

const PREFIX_POOL_URL = "/api/voucher_pool";
app.use(PREFIX_POOL_URL, createVoucherPoolRouter);
app.use(PREFIX_POOL_URL, updateVoucherPoolRouter);
app.use(PREFIX_POOL_URL, showVoucherPoolRouter);
app.use(PREFIX_POOL_URL, indexVoucherPoolRouter);

const PREFIX_VOUCHER_URL = "/api/vouchers";
app.use(PREFIX_VOUCHER_URL, createVoucherRouter);
app.use(PREFIX_VOUCHER_URL, updateVoucherRouter);
app.use(PREFIX_VOUCHER_URL, showVoucherRouter);
app.use(PREFIX_VOUCHER_URL, indexVoucherRouter);

app.all("*", async (req: Request, res: Response) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
