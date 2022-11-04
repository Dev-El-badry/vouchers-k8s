import express, { NextFunction } from "express";
import { BadRequestError } from "@dev0vouchers/common";
import { User } from "../models/User";
import { PasswordService } from "../services/password-service";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post("/signin", async (req: any, res: any, next: NextFunction) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (!userExists) {
    throw new BadRequestError("invalid credentials");
  }

  const response = await PasswordService.compare(userExists.password, password);
  if (!response) {
    throw new BadRequestError("invalid credentials");
  }

  const payload = jwt.sign(
    { id: userExists.id, email: userExists.email },
    process.env.JWT_KEY!
  );
  req.session = {
    jwt: payload,
  };

  res.status(201).send(userExists);
});

export { router as signInRouter };
