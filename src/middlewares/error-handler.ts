import { NextFunction, Request, Response } from "express";
import { INTERNAL_SERVER_ERROR } from '../constants/constants';

interface ICustomError extends Error {
  statusCode: number,
  message: string,
}

export const errorHandler = (
  err: ICustomError,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { statusCode = INTERNAL_SERVER_ERROR, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === INTERNAL_SERVER_ERROR
        ? 'The server encountered an error and could not complete your request'
        : message,
    });
};

export default { errorHandler };
