import request from "supertest";
import { app } from "../../../../app";

import mongoose from "mongoose";

it("has a route handler listing to /api/vouchers for get requests", async () => {
  const response = await request(app)
    .get("/api/vouchers")
    .set("Cookie", global.signin())
    .send({});
  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/vouchers`).send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .get(`/api/vouchers`)
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

const createVoucher = async () => {
  const voucherPoolResponse = await request(app)
    .post("/api/voucher_pool")
    .set("Cookie", global.signin())
    .send({ title: "new voucher" })
    .expect(201);

  await request(app).post("/api/vouchers").set("Cookie", global.signin()).send({
    amount: 10,
    expire_at: "2022-11-07",
    voucher_pool_id: voucherPoolResponse.body.id,
  });
};

it("can fetch a list of vouchers", async () => {
  await createVoucher();
  await createVoucher();
  await createVoucher();

  const response = await request(app)
    .get(`/api/vouchers`)
    .set("Cookie", global.signin())
    .send()
    .expect(201);
  expect(response.body.length).toEqual(3);
});
