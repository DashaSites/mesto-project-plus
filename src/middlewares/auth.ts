import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import UnauthorizedError from '../errors/authorization-error';

// Авторизация запроса: проверяем, правильный ли передан токен
export default (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.cookies;
  console.log(token);

  if (!token) {
    return next(new UnauthorizedError('Authorization is needed'));
  }

  // проверяем: пользователь прислал именно тот токе, который был выдан ему ранее?
  let payload;
  try {
    // попытаемся проверить токен
    payload = jwt.verify(token, 'some-secret-key') as JwtPayload;
  } catch (err) {
    // отправим ошибку, если токен не прошел
    return next(new UnauthorizedError('Authorization is needed'));
  }
  // записываем пейлоуд в объект запроса
  req.user = payload._id;

  // пропускаем запрос дальше
  return next();
};
