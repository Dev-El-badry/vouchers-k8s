import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Voucher } from "../../models/voucher";
import { natsWrapper } from "../../nats-wrapper";

it("returns an error if the voucher does not exist", async () => {
  await request(app)
    .post("/api/redeem")
    .set("Cookie", global.signin())
    .send({ code: "abc" })
    .expect(404);
});

it("returns an error if the voucher is expired", async () => {
  const voucher = Voucher.build({
    id: mongoose.Types.ObjectId().toHexString(),
    code: "abc",
    amount: 200,
    expireAt: new Date("2022-11-5"),
  });
  await voucher.save();

  await request(app)
    .post("/api/redeem")
    .set("Cookie", global.signin())
    .send({ code: voucher.code })
    .expect(400);
});

it("returns an error if the voucher is used", async () => {
  const cookie = global.signin();

  const voucher = Voucher.build({
    id: mongoose.Types.ObjectId().toHexString(),
    code: "abc",
    amount: 200,
    expireAt: new Date("2022-11-5"),
  });
  await voucher.save();

  await request(app)
    .post("/api/redeem")
    .set("Cookie", cookie)
    .send({ code: voucher.code });
  await request(app)
    .post("/api/redeem")
    .set("Cookie", cookie)
    .send({ code: voucher.code })
    .expect(400);
});

it("redeem voucher", async () => {
  const cookie = global.signin();

  const voucher = Voucher.build({
    id: mongoose.Types.ObjectId().toHexString(),
    code: "fsdfdsv",
    amount: 200,
    expireAt: new Date("2022-11-9"),
  });
  await voucher.save();

  await request(app)
    .post("/api/redeem")
    .set("Cookie", cookie)
    .send({ code: voucher.code })
    .expect(201);
});

it("emits an redeem created event", async () => {
  const cookie = global.signin();

  const voucher = Voucher.build({
    id: mongoose.Types.ObjectId().toHexString(),
    code: "abc",
    amount: 200,
    expireAt: new Date("2022-11-9"),
  });
  await voucher.save();

  await request(app)
    .post("/api/redeem")
    .set("Cookie", cookie)
    .send({ code: voucher.code })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
