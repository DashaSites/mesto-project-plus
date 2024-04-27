import { Router } from 'express';
import { createCard, deleteCardById, getCards } from '../controllers/cards';

const cardRouter = Router();

// Маршруты карточек:

// Маршрут возвращает все карточки
cardRouter.get('/', getCards);

// Создает карточку
cardRouter.post('/', createCard);

// Удаляет карточку по идентификатору
cardRouter.delete('/:cardId', deleteCardById);

export default cardRouter;
