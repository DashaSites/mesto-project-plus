import { CONFLICT_ERROR } from '../constants/constants';
// когда пользователь пытается зарегистрироваться по уже существующему в базе email

export default class ConflictError extends Error {
  statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = CONFLICT_ERROR;
  }
}
