import { NextFunction, Request, Response } from "express";

export default (err, req: Request, res: Response, next: NextFunction) => {
  res.send({ message: err.message });
};
