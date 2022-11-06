import request from "supertest";
import { app } from "../../../../app";
import { VoucherPool } from "../../models/voucher-pool";
import mongoose from "mongoose";

it("has a route handler listing to /api/voucher_pool for get requests", async () => {
  const response = await request(app)
    .get("/api/voucher_pool")
    .set("Cookie", global.signin())
    .send({});
  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/voucher_pool`).send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .get(`/api/voucher_pool`)
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

const createVoucherPool = () => {
  return request(app)
    .post("/api/voucher_pool")
    .set("Cookie", global.signin())
    .send({
      title: "new voucher",
    });
};

it("can fetch a list of voucher pools", async () => {
  await createVoucherPool();
  await createVoucherPool();
  await createVoucherPool();

  const response = await request(app)
    .get(`/api/voucher_pool`)
    .set("Cookie", global.signin())
    .send()
    .expect(200);
  expect(response.body.length).toEqual(3);
});
