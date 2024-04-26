import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
// import { User } from './database/User';
import bodyParser from 'body-parser';
import 'dotenv/config';
import cardRouter from './routes/cards';
import userRouter from './routes/users';

const { PORT = 3000, MONGO_URL } = process.env;
const app = express();

app.use(bodyParser.json());

// Временная заглушка для будущей логики авторизации
app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = {
    _id: '662c2971a9308ca534ddc741',
  };
  next();
});

app.use('/users', userRouter);

app.use('/cards', cardRouter);

// Подключаюсь к базе данных:
const connect = async () => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(MONGO_URL as string);
  console.log('Connected to the database');

  await app.listen(PORT);
  console.log(`App listening on port ${PORT}`);
};

connect();

// Подключить роуты
// NewUser.create({ name: 'Дед Пихто', about: 'Кот ученый', avatar: 'testUser' });

console.log('hi-1');
