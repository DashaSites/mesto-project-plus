import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import {
  REQUEST_SUCCEEDED,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND_ERROR,
  BAD_REQUEST_ERROR,
  RESOURCE_CREATED,
} from '../constants/constants';
import Card from '../models/card';

// Методы контроллеров описывают, как обрабатывать данные и какой результат возвращать.

// + Получаем все карточки
export const getCards = async (req: Request, res: Response) => {
  try {
    const cards = await Card.find({});
    return res.status(REQUEST_SUCCEEDED).send(cards);
  } catch (error) {
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal server error' });
  }
};

// + Создаем новую карточку
export const createCard = async (req: Request, res: Response) => {
  try {
    const { name, link } = req.body;
    const { _id } = req.user; // id текущего пользователя
    const newCard = await Card.create({ name, link, owner: _id }); // создаю карточку
    return res.status(RESOURCE_CREATED).send({ data: newCard }); // возвращаю ее с сервера
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Incorrect data' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal server error' });
  }
};

// + Удаляем карточку по идентификатору
export const deleteCardById = async (req: Request, res: Response) => {
  try {
    const { cardId } = req.params; // идентификатор карточки из урла
    const { _id } = req.user; // id текущего пользователя
    const card = await Card.findByIdAndDelete(cardId).orFail(() => {
      const error = new Error('Card was not found');
      error.name = 'NotFoundError';
      return error;
    });
    if (card.owner.toString() !== _id) {
      throw new Error('You are not permitted to delete this card');
    }
    return res.status(REQUEST_SUCCEEDED).send(card);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Invalid user data' });
    }
    if (error instanceof Error && error.name === 'NotFoundError') { // карточка не найдена
      return res.status(NOT_FOUND_ERROR).send({ message: error.message });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal server error' }); // ошибка сервера
  }
};

// + Функция-декоратор для лайков
const updateLike = async (req: Request, res: Response, next: NextFunction, method: string) => {
  try {
    const { cardId } = req.params;
    const updatedCard = await Card
      .findByIdAndUpdate(cardId, { [method]: { likes: req.user._id } }, { new: true })
      .orFail(() => {
        const error = new Error('Card was not found');
        error.name = 'NotFoundError';
        return error;
      });
    return res.status(REQUEST_SUCCEEDED).send(updatedCard);
  } catch (error) {
    if (error instanceof Error && error.name === 'NotFoundError') {
      return res.status(NOT_FOUND_ERROR).send({ message: error.message });
    }
    if (error instanceof mongoose.Error.CastError) {
      return res.status(BAD_REQUEST_ERROR).send({ message: 'Incorrect data' });
    }
    return res.status(INTERNAL_SERVER_ERROR).send({ message: 'Internal server error' });
  }
};

// + Лайкаем карточку
export const likeCard = (req: Request, res: Response, next: NextFunction) => updateLike(req, res, next, '$addToSet');

// + Убираем лайк с карточки
export const dislikeCard = (req: Request, res: Response, next: NextFunction) => updateLike(req, res, next, '$pull');
