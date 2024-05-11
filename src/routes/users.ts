import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import {
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getCurrentUserInfo,
} from '../controllers/users';
import { urlRegEx } from '../constants/constants';

const userRouter = Router();

// Маршрут возвращает всех пользователей
userRouter.get('/', getUsers);

// Получает информацию о текущем пользователе
userRouter.get('/me', getCurrentUserInfo);

// Возвращает пользователя по _id
userRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
}), getUserById);

// Обновляет профиль пользователя
userRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(200),
  }),
}), updateUserProfile);

// Обновляет аватар пользователя
userRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().pattern(urlRegEx).message('The url is incorrect'),
  }),
}), updateUserAvatar);

export default userRouter;
