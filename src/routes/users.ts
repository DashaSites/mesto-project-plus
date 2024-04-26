import express, { Router, Request, Response } from 'express';

// Метод Router из библ-ки express создает объект, на который мы повесим обработчики:
const router = Router();



// Маршруты роутера (routes) связывают адрес запроса с функцией контроллера.
// Благодаря этому сервер понимает, что обращение по адресу /users/signup —
// это запрос на регистрацию, а /users/signin — на авторизацию. Роутер обрабатывает
// входящий запрос, находит для него соответствующий обработчик и вызывает его.


// router.get('/books', getBooks);

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
