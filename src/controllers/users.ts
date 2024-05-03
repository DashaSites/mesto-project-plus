import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import {
  BAD_REQUEST_ERROR,
  NOT_FOUND_ERROR,
  REQUEST_SUCCEEDED,
  RESOURCE_CREATED,
  INTERNAL_SERVER_ERROR,
} from '../constants/constants';
import User from '../models/user';

// Контроллеры (controllers) содержат основную логику обработки запроса.
// Методы описывают, как обрабатывать данные и какой результат возвращать.

// Получаем всех пользователей
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    return res.status(REQUEST_SUCCEEDED).send(users);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal server error' });
  }
};

// Находим пользователя по айди
export const getUserById = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail(() => {
      const error = new Error('User with such id was not found');
      error.name = 'NotFoundError';
      return error;
    });
    return res.status(REQUEST_SUCCEEDED).send(user);
  } catch (error) {
    if (error instanceof Error && error.name === 'NotFoundError') {
      return res.status(NOT_FOUND_ERROR).send({ message: error.message });
    }
    if (error instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Invalid user id' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal server error' });
  }
};

// Создаем нового пользователя
export const createUser = async (req: Request, res: Response) => {
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
      throw new Error('User not found');
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
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Incorrect data' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal server error' });
  }
};

// Обновляем профиль
export const updateUserProfile = async (req: Request, res: Response) => {
  try {
    const { _id } = req.user; // id текущего пользователя
    // подразумевается, что в теле запроса пришел профиль уже с обновленными полями
    // вытаскиваю их из req.body
    const { name, about } = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { name, about },
      { new: true, runValidators: true },
    ).orFail(() => {
      const error = new Error('User not found');
      error.name = 'NotFoundError';
      return error;
    });
    return res.status(REQUEST_SUCCEEDED).send(updatedUser);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Incorrect data' });
    }
    if (error instanceof Error && error.name === 'NotFoundError') {
      return res.status(NOT_FOUND_ERROR).send({ message: error.message });
    }
    if (error instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Invalid user data' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal server error' });
  }
};

// Обновляем аватар
export const updateUserAvatar = async (req: Request, res: Response) => {
  try {
    const { _id } = req.user; // id текущего пользователя
    // пришедший в теле запроса новый аватар - вытаскиваю:
    const { avatar } = req.body;
    const updatedAvatar = await User.findByIdAndUpdate(
      _id,
      { avatar },
      { new: true, runValidators: true },
    ).orFail(() => {
      const error = new Error('User not found');
      error.name = 'NotFoundError';
      return error;
    });
    return res.status(REQUEST_SUCCEEDED).send(updatedAvatar);
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Incorrect data' });
    }
    if (error instanceof Error && error.name === 'NotFoundError') {
      return res.status(NOT_FOUND_ERROR).send({ message: error.message });
    }
    if (error instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Invalid user data' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal server error' });
  }
};

// Аутентификация (логин)
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      // создаю токен: пейлоуд токена и секретный ключ подписи
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      // возвращаю токен
      res.send({ token });
    })
    .catch((err) => {
      res
        .status(401)
        .send({ message: err.message });
    });
};
