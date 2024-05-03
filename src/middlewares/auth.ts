/* eslint-disable func-names */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Авторизация запроса: проверяем, правильный ли передан токен
export default function (req: Request, res: Response, next: NextFunction) {
  // тут будет вся авторизация
  const tokenCookie = req.cookies.token;

  // убеждаемся, что он есть или начинается с Bearer
  if (!tokenCookie || !tokenCookie.startsWith('Bearer ')) {
    return res
      .status(401)
      .send({ message: 'Authorization is needed' });
  }
  // извлечем токен (выкинем из заголовка приставку 'Bearer ')
  const token = tokenCookie.replace('Bearer ', '');

  // проверяем: пользователь прислал именно тот токе, который был выдан ему ранее?
  try {
    // попытаемся проверить токен
    const payload = jwt.verify(token, 'some-secret-key');
    // записываем пейлоуд в объект запроса
    req.user = payload as {_id: string};
  } catch (err) {
    // отправим ошибку, если не получилось
    return res
      .status(401)
      .send({ message: 'Authorization is needed' });
  }

  // пропускаем запрос дальше
  next();
  return undefined;
}
