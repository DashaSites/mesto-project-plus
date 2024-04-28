import { Router } from 'express';
import {
  createCard,
  deleteCardById,
  getCards,
  likeCard,
  unlikeCard,
} from '../controllers/cards';

const cardRouter = Router();

// Маршруты карточек:

// Маршрут возвращает все карточки
cardRouter.get('/', getCards);

// Создает карточку
cardRouter.post('/', createCard);

// Удаляет карточку по идентификатору
cardRouter.delete('/:cardId', deleteCardById);

// Поставить лайк карточке
cardRouter.put('/:cardId/likes', likeCard);

// Убрать лайк с карточки
cardRouter.delete('/:cardId/likes', unlikeCard);

export default cardRouter;
