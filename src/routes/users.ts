import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
} from '../controllers/users';

const userRouter = Router();

// Маршрут возвращает всех пользователей
userRouter.get('/', getUsers);

// Возвращает пользователя по _id
userRouter.get('/:userId', getUserById);

// Обновляет профиль пользователя
userRouter.patch('/me', updateUserProfile);

// Обновляет аватар пользователя
userRouter.patch('/me/avatar', updateUserAvatar);

export default userRouter;
