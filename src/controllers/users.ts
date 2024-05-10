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

// Контроллеры (controllers) содержат основную логику обработки запроса.
// Методы описывают, как обрабатывать данные и какой результат возвращать.

// + Получаем всех пользователей
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    return res.status(REQUEST_SUCCEEDED).send(users);
  } catch (error) {
    return next(error);
    // return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal server error' });
  }
};

// + Находим пользователя по айди
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(() => {
      throw new NotFoundError('User with such id was not found');
      // const error = new Error('User with such id was not found');
      // error.name = 'NotFoundError';
      // return error;
    });
    return res.status(REQUEST_SUCCEEDED).send(user);
  } catch (error) {
    // if (error instanceof Error && error.name === 'NotFoundError') {
    //   return res.status(NOT_FOUND_ERROR).send({ message: error.message });
    // }
    if (error instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Invalid user id'));
      // return res.status(BAD_REQUEST_ERROR).send({ message: 'Invalid user id' });
    }
    return next(error);
    // return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal server error' });
  }
};

// + Получаем информацию о текущем пользователе
export const getCurrentUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  try { // находим текущего пользователя по его токену, который лежит в req.user
    const user = await User.findById(req.user).orFail(() => {
      throw new NotFoundError('User was not found');
      // const error = new Error('User was not found');
      // error.name = 'NotFoundError';
      // return error;
    });
    return res.status(REQUEST_SUCCEEDED).send(user);
  } catch (error) {
    // if (error instanceof Error && error.name === 'NotFoundError') {
    //   return res.status(NOT_FOUND_ERROR).send({ message: error.message });
    // }
    if (error instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Invalid user id'));
      // return res.status(BAD_REQUEST_ERROR).send({ message: 'Invalid user id' });
    }
    return next(error);
    // return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal server error' });
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
    if (!newUser) {
      throw new NotFoundError('User was not found');
    }
    // const { _id, name, about, avatar } = newUser;
    return res.status(RESOURCE_CREATED).send({ // send({ data: newUser });
      _id: newUser._id,
      name: newUser.name,
      about: newUser.about,
      avatar: newUser.avatar,
      email: newUser.email,
    });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Incorrect data'));
      // return res.status(BAD_REQUEST_ERROR).send({ message: 'Incorrect data' });
    }
    return next(error);
    // return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal server error' });
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
      // const error = new Error('User not found');
      // error.name = 'NotFoundError';
      // return error;
    });
    return res.status(REQUEST_SUCCEEDED).send(updatedUser);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Incorrect data'));
      // return res.status(BAD_REQUEST_ERROR).send({ message: 'Incorrect data' });
    }
    // if (error instanceof Error && error.name === 'NotFoundError') {
    //   return res.status(NOT_FOUND_ERROR).send({ message: error.message });
    // }
    if (error instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Invalid user data'));
      // return res.status(BAD_REQUEST_ERROR).send({ message: 'Invalid user data' });
    }
    return next(error);
    // return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal server error' });
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
      // const error = new Error('User not found');
      // error.name = 'NotFoundError';
      // return error;
    });
    return res.status(REQUEST_SUCCEEDED).send(updatedAvatar);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Incorrect data'));
      // return res.status(BAD_REQUEST_ERROR).send({ message: 'Incorrect data' });
    }
    // if (error instanceof Error && error.name === 'NotFoundError') {
    //   return res.status(NOT_FOUND_ERROR).send({ message: error.message });
    // }
    if (error instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Invalid user data'));
      // return res.status(BAD_REQUEST_ERROR).send({ message: 'Invalid user data' });
    }
    return next(error);
    // return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal server error' });
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
