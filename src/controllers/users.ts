import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import {
  REQUEST_SUCCEEDED,
  RESOURCE_CREATED,
} from '../constants/constants';
import User from '../models/user';
import NotFoundError from '../errors/not-found-error';
import BadRequestError from '../errors/bad-request-error';
import ConflictError from '../errors/conflict-error';

// Контроллеры (controllers) содержат основную логику обработки запроса.
// Методы описывают, как обрабатывать данные и какой результат возвращать.

// + Получаем всех пользователей
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    return res.status(REQUEST_SUCCEEDED).send(users);
  } catch (error) {
    return next(error);
  }
};

// + Находим пользователя по айди
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(() => {
      throw new NotFoundError('User with such id was not found');
    });
    return res.status(REQUEST_SUCCEEDED).send(user);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Invalid user id'));
    }
    return next(error);
  }
};

// + Получаем информацию о текущем пользователе
export const getCurrentUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  try { // находим текущего пользователя по его токену, который лежит в req.user
    const user = await User.findById(req.user).orFail(() => {
      throw new NotFoundError('User was not found');
    });
    return res.status(REQUEST_SUCCEEDED).send(user);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Invalid user id'));
    }
    return next(error);
  }
};

// + Создаем нового пользователя
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name,
      about,
      avatar,
      email,
      password,
    } = req.body; // извлекаю данные запроса
    const hashedPassword = await bcrypt.hash(password, 10); // хеширую пароль
    // записываю в базу юзера с захешированным паролем
    const newUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    });
    return res.status(RESOURCE_CREATED).send({
      _id: newUser._id,
      name: newUser.name,
      about: newUser.about,
      avatar: newUser.avatar,
      email: newUser.email,
    });
  } catch (error) {
    if (error.code === 11000) {
      return next(new ConflictError('User with such email is already registered'));
    }
    if (error instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Incorrect data'));
    }
    return next(error);
  }
};

// + Обновляем профиль
export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user; // id текущего пользователя
    // подразумевается, что в теле запроса пришел профиль уже с обновленными полями
    // вытаскиваю их из req.body
    const { name, about } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, about },
      { new: true, runValidators: true },
    ).orFail(() => {
      throw new NotFoundError('User was not found');
    });
    return res.status(REQUEST_SUCCEEDED).send(updatedUser);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Incorrect data'));
    }
    return next(error);
  }
};

// + Обновляем аватар
export const updateUserAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user; // id текущего пользователя
    // пришедший в теле запроса новый аватар - вытаскиваю:
    const { avatar } = req.body;
    const updatedAvatar = await User.findByIdAndUpdate(
      userId,
      { avatar },
      { new: true, runValidators: true },
    ).orFail(() => {
      throw new NotFoundError('User was not found');
    });
    return res.status(REQUEST_SUCCEEDED).send(updatedAvatar);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Incorrect data'));
    }
    return next(error);
  }
};

// Аутентификация (логин)
export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создаю токен: пейлоуд токена и секретный ключ подписи
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res
        .cookie('token', token, { httpOnly: true }) // куки сохраняется в заголовке
        .json({ message: 'You are successfully logged in' });
    })
    .catch(next);
};
