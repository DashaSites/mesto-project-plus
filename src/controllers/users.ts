import { Request, Response, NextFunction } from 'express';
import User from '../models/user';

// Контроллеры (controllers) содержат основную логику обработки запроса —
// как правило, набор методов для определённой сущности. Например,
// В контроллерах - основная логика обработки запроса.
// Для User это методы создания createUser и авторизации signinUser.
// Методы описывают, как обрабатывать данные и какой результат возвращать.

export const getUsers = (req: Request, res: Response) => {
  res.send({ });
};

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.create({
      name: req.body.name,
      about: req.body.about,
      avatar: req.body.avatar,
    });
    if (!user) {
      throw new Error('No user found');
    }
    res.send({ data: user });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export const getUserById = (req: Request, res: Response) => {
  res.send({ message: 'smth' });
};
