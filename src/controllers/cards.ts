import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';

// Методы контроллеров описывают, как обрабатывать данные и какой результат возвращать.

// Получаем все карточки
export const getCards = async (req: Request, res: Response) => {
  res.send({ message: 'getCards' });
};

// Создаем новую карточку
export const createCard = async (req: Request, res: Response) => {
  res.send({ message: 'createCard' });
};

// Удаляем карточку по идентификатору
export const deleteCardById = async (req: Request, res: Response) => {
  res.send({ message: 'deleteCardById' });
};
