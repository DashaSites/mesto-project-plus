/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import {
  REQUEST_SUCCEEDED,
  RESOURCE_CREATED,
} from '../constants/constants';
import Card from '../models/card';
import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';

// Методы контроллеров описывают, как обрабатывать данные и какой результат возвращать.

// + Получаем все карточки
export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});
    return res.status(REQUEST_SUCCEEDED).send(cards);
  } catch (error) {
    return next(error);
  }
};

// + Создаем новую карточку
export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const newCard = await Card.create({ name, link, owner: req.user }); // создаю карточку
    return res.status(RESOURCE_CREATED).send({ data: newCard }); // возвращаю ее с сервера
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      next(new BadRequestError('Incorrect data'));
    } else {
      next(error);
    }
  }
};

// + Удаляем карточку по идентификатору
export const deleteCardById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cardId } = req.params; // идентификатор карточки из урла
    const cardIdString = cardId.toString();
    const idString = String(req.user);

    const deletedCard = await Card.checkAndDeleteCard(cardIdString, idString);
    return res.status(REQUEST_SUCCEEDED).send(deletedCard);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) { // ошибка про некорректный айдишник
      next(new BadRequestError('Invalid data'));
    } else {
      next(error);
    }
  }
};

// + Функция-декоратор для лайков
const updateLike = async (req: Request, res: Response, next: NextFunction, method: string) => {
  try {
    const { cardId } = req.params;
    const updatedCard = await Card
      .findByIdAndUpdate(cardId, { [method]: { likes: req.user } }, { new: true })
      .orFail(() => {
        throw new NotFoundError('Card was not found');
      });
    return res.status(REQUEST_SUCCEEDED).send(updatedCard);
  } catch (error) {
    if (error instanceof mongoose.Error.CastError) {
      next(new BadRequestError('Incorrect data'));
    } else {
      next(error);
    }
  }
};

// + Лайкаем карточку
export const likeCard = (req: Request, res: Response, next: NextFunction) => updateLike(req, res, next, '$addToSet');

// + Убираем лайк с карточки
export const dislikeCard = (req: Request, res: Response, next: NextFunction) => updateLike(req, res, next, '$pull');
