import request from "supertest";
import { app } from "../../../../app";
import { VoucherPool } from "../../models/voucher-pool";
import mongoose from "mongoose";

it("can only be accessed if the user is signed in", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).put(`/api/voucher_pool/${id}`).send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app)
    .put(`/api/voucher_pool/${id}`)
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  const title = "voucher title";
  const response = await request(app)
    .post("/api/voucher_pool")
    .set("Cookie", global.signin())
    .send({ title })
    .expect(201);

  await request(app)
    .put(`/api/voucher_pool/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({
      title: "",
    })
    .expect(400);

  await request(app)
    .put(`/api/voucher_pool/${response.body.id}`)
    .set("Cookie", global.signin())
    .send({})
    .expect(400);
});

it("update a voucher pool with valid inputs", async () => {
  const cookie = global.signin();

  const title = "voucher title";
  const response = await request(app)
    .post("/api/voucher_pool")
    .set("Cookie", cookie)
    .send({ title })
    .expect(201);

  await request(app)
    .put(`/api/voucher_pool/${response.body.id}`)
    .set("Cookie", cookie)
    .send({ title: "new title" })
    .expect(201);

  const pool = await VoucherPool.findById(response.body.id);
  expect(pool!.title).toEqual("new title");
});
