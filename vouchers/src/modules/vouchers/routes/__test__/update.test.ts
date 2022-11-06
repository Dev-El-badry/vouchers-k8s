import request from "supertest";
import { app } from "../../../../app";
import { Voucher } from "../../models/voucher";
import mongoose from "mongoose";
import { natsWrapper } from "../../../../nats-wrapper";

it("has a route handler listing t` /api/vouchers`for /${id}post requests", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app).put(`/api/vouchers/${id}`).send({});
  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).put(`/api/vouchers/${id}`).send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .put(`/api/vouchers/${id}`)
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid amount is provided", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/vouchers/${id}`)
    .set("Cookie", global.signin())
    .send({
      expire_at: "2022-11-07",
    })
    .expect(400);

  await request(app)
    .put(`/api/vouchers/${id}`)
    .set("Cookie", global.signin())
    .send({
      amount: 0,
      expire_at: "2022-11-07",
    })
    .expect(400);
});

it("update a voucher  with valid inputs", async () => {
  const cookie = global.signin();
  const voucherPoolResponse = await request(app)
    .post("/api/voucher_pool")
    .set("Cookie", cookie)
    .send({ title: "new voucher" })
    .expect(201);

  const response = await request(app)
    .post("/api/vouchers")
    .set("Cookie", cookie)
    .send({
      amount: 12,
      expire_at: "2022-11-07",
      voucher_pool_id: voucherPoolResponse.body.id,
    });
  const amount = 10;
  await request(app)
    .put(`/api/vouchers/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ amount, expire_at: "2022-11-07" })
    .expect(201);

  const pool = await Voucher.findById(response.body.id);
  expect(pool!.amount).toEqual(amount);
});

it("publishes an event", async () => {
  const cookie = global.signin();
  const voucherPoolResponse = await request(app)
    .post("/api/voucher_pool")
    .set("Cookie", cookie)
    .send({ title: "new voucher" })
    .expect(201);

  const response = await request(app)
    .post("/api/vouchers")
    .set("Cookie", cookie)
    .send({
      amount: 12,
      expire_at: "2022-11-07",
      voucher_pool_id: voucherPoolResponse.body.id,
    });
  const amount = 10;
  await request(app)
    .put(`/api/vouchers/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ amount, expire_at: "2022-11-07" })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalledTimes(2);
});
