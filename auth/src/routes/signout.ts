import express, { NextFunction } from "express";

const router = express.Router();

router.post("/signout", async (req: any, res: any, next: NextFunction) => {
  //store token in cookie
  req.session = null;

  res.status(201).send({});
});

export { router as signOutRouter };
