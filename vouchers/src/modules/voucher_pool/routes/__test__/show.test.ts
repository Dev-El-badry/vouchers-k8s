import request from "supertest";
import { app } from "../../../../app";
import { VoucherPool } from "../../models/voucher-pool";
import mongoose from "mongoose";

it("can only be accessed if the user is signed in", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).get(`/api/voucher_pool/${id}`).send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .get(`/api/voucher_pool/${id}`)
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns the voucher pool is found", async () => {
  const title = "voucher title";
  const response = await request(app)
    .post("/api/voucher_pool")
    .set("Cookie", global.signin())
    .send({ title })
    .expect(201);

  const voucherPoolResponse = await request(app)
    .get(`/api/voucher_pool/${response.body.id}`)
    .set("Cookie", global.signin())
    .send()
    .expect(200);
  expect(voucherPoolResponse.body.title).toEqual(title);
});
