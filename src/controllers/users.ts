import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/user';

// Контроллеры (controllers) содержат основную логику обработки запроса.
// Методы описывают, как обрабатывать данные и какой результат возвращать.

// Получаем всех пользователей
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send({ message: 'Server error' });
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
    return res.status(200).send(user);
  } catch (error) {
    if (error instanceof Error && error.name === 'NotFoundError') {
      return res.status(404).send({ message: error.message });
    }
    if (error instanceof mongoose.Error.CastError) {
      return res.status(400).send({ message: 'Invalid user id' });
    }
    return res.status(500).send({ message: error });
  }
};

// Создаем нового пользователя
export const createUser = async (req: Request, res: Response) => {
  try {
    const newUser = await User.create(req.body);
    if (!newUser) {
      throw new Error('User not found');
    }
    return res.status(201).send({ data: newUser });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(400).send({ message: error });
    }
    return res.status(500).send({ message: error });
  }
};
