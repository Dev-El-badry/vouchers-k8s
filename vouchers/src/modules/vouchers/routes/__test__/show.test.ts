import request from "supertest";
import { app } from "../../../../app";
import mongoose from "mongoose";

it("can only be accessed if the user is signed in", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/vouchers/${id}`).send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .get(`/api/vouchers/${id}`)
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns the voucher pool is found", async () => {
  const amount = 10;
  const voucherPoolResponse = await request(app)
    .post("/api/voucher_pool")
    .set("Cookie", global.signin())
    .send({ title: "new voucher" })
    .expect(201);

  const response = await request(app)
    .post("/api/vouchers")
    .set("Cookie", global.signin())
    .send({
      amount,
      expire_at: "2022-11-07",
      voucher_pool_id: voucherPoolResponse.body.id,
    });

  const voucherResponse = await request(app)
    .get(`/api/vouchers/${response.body.id}`)
    .set("Cookie", global.signin())
    .send()
    .expect(201);
  expect(voucherResponse.body.amount).toEqual(amount);
});
