import request from "supertest";
import { app } from "../../../../app";
import { Voucher } from "../../models/voucher";
import mongoose from "mongoose";
import { natsWrapper } from "../../../../nats-wrapper";

it("has a route handler listing to /api/vouchers for post requests", async () => {
  const response = await request(app).post("/api/vouchers").send({});
  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/vouchers").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/vouchers")
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid amount is provided", async () => {
  const voucherPool = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post("/api/vouchers")
    .set("Cookie", global.signin())
    .send({
      voucher_pool_id: voucherPool,
      expire_at: Date.now(),
    })
    .expect(400);

  await request(app)
    .post("/api/vouchers")
    .set("Cookie", global.signin())
    .send({
      amount: 0,
      voucher_pool_id: voucherPool,
      expire_at: Date.now(),
    })
    .expect(400);
});

it("returns an error if an invalid voucher  id is provided", async () => {
  await request(app)
    .post("/api/vouchers")
    .set("Cookie", global.signin())
    .send({
      amount: 10,
      expire_at: Date.now(),
    })
    .expect(400);
});

it("returns an error if an invalid expire at id is provided", async () => {
  const voucherPool = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .post("/api/vouchers")
    .set("Cookie", global.signin())
    .send({
      amount: 10,
      expire_at: "sdcsd",
      voucher_pool_id: voucherPool,
    })
    .expect(400);
});

it("create a voucher  with valid inputs", async () => {
  const voucherPoolResponse = await request(app)
    .post("/api/voucher_pool")
    .set("Cookie", global.signin())
    .send({ title: "new voucher" })
    .expect(201);

  let vouchers = await Voucher.find({});
  expect(vouchers.length).toEqual(0);

  const amount = 10;
  await request(app).post("/api/vouchers").set("Cookie", global.signin()).send({
    amount,
    expire_at: "2022-11-07",
    voucher_pool_id: voucherPoolResponse.body.id,
  });

  vouchers = await Voucher.find({});
  expect(vouchers.length).toEqual(1);
  expect(vouchers[0].amount).toEqual(amount);
});

it("publishes an event", async () => {
  const title = "asldkfj";

  const voucherPoolResponse = await request(app)
    .post("/api/voucher_pool")
    .set("Cookie", global.signin())
    .send({ title: "new voucher" })
    .expect(201);

  const amount = 10;
  await request(app).post("/api/vouchers").set("Cookie", global.signin()).send({
    amount,
    expire_at: "2022-11-07",
    voucher_pool_id: voucherPoolResponse.body.id,
  });

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
