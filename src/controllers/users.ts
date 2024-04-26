import { Request, Response } from 'express';
import User from '../models/user';

// Контроллеры (controllers) содержат основную логику обработки запроса —
// как правило, набор методов для определённой сущности. Например,
// для пользователя User это методы создания createUser и авторизации signinUser.
// В методах описывают, как обрабатывать переданные данные и какой рез-т возвращать

// Здесь будет описание модели пользователя
// реализуем функцию создания пользователя
const createUser = (req: Request, res: Response) => User.create({
  name: req.body.name,
  about: req.body.about,
  avatar: req.body.avatar,

})
  .then((user) => res.send(user))
  .catch((err) => res.status(400).send(err));

export default createUser;
