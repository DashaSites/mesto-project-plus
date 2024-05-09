import { UNAUTHORIZED_ERROR } from '../constants/constants';

export default class UnauthorizedError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = UNAUTHORIZED_ERROR;
  }
}
