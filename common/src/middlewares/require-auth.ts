import { NextFunction, Request, Response } from "express";
import { NoAuthorized } from "../errors/no-authorized";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if(!req.currentUser) {
    throw new NoAuthorized();
  }

  next();
};