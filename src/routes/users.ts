import { Router } from 'express';
import {
  getUsers,
  getUserById,
  createUser,
} from '../controllers/users';

const userRouter = Router();

// + Маршрут возвращает всех пользователей
userRouter.get('/', getUsers);

// + Возвращает пользователя по _id
userRouter.get('/:userId', getUserById);

// + Создаёт пользователя
userRouter.post('/', createUser);

export default userRouter;

// export default router.get('/users/:id', (req: Request, res: Response) => {
//   // хорошая практика: явно привести типы
//   // индекс в массиве - число, поэтому приводим к Number
//   const id = Number(req.params.id);
//   if (!users[id]) {
//     res.send(`Такого пользователя не существует`);
//     return;
//   }

//   const { name, age } = users[id];

//   res.send(`Пользователь ${name}, ${age} лет`);
// });
