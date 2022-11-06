import request from "supertest";
import { app } from "../../../../app";
import { VoucherPool } from "../../models/voucher-pool";

it("has a route handler listing to /api/voucher_pool for post requests", async () => {
  const response = await request(app).post("/api/voucher_pool").send({});
  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  await request(app).post("/api/voucher_pool").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const response = await request(app)
    .post("/api/voucher_pool")
    .set("Cookie", global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/voucher_pool")
    .set("Cookie", global.signin())
    .send({
      title: "",
    })
    .expect(400);

  await request(app)
    .post("/api/voucher_pool")
    .set("Cookie", global.signin())
    .send({})
    .expect(400);
});

it("create a voucher pool with valid inputs", async () => {
  let pools = await VoucherPool.find({});
  expect(pools.length).toEqual(0);

  const title = "voucher title";
  await request(app)
    .post("/api/voucher_pool")
    .set("Cookie", global.signin())
    .send({ title })
    .expect(201);

  pools = await VoucherPool.find({});
  expect(pools.length).toEqual(1);
  expect(pools[0].title).toEqual(title);
});
