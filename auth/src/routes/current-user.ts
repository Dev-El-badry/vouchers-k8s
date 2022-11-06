import express, { Request, Response } from "express";
import { currentUser, requireAuth } from "@dev0vouchers/common";

const router = express.Router();

router.get("/currentuser", currentUser, (req: any, res: any) => {
  res.status(201).send({ currentUser: req.currentUser || null });
});

export { router as currentUserRouter };
