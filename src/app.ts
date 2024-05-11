import express, {
  json,
} from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { celebrate, errors, Joi } from 'celebrate';
import 'dotenv/config';
import notFoundRouter from './routes/not-found';
import cardRouter from './routes/cards';
import userRouter from './routes/users';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import { errorLogger, requestLogger } from './middlewares/logger';
import { errorHandler } from './middlewares/error-handler';
import { urlRegEx } from './constants/constants';

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();
app.use(json());
app.use(cookieParser());

// В app.ts важно сначала подключать мидлвары, а потом подключать те роуты, которые
// используют результаты работы этих мидлваров

app.use(requestLogger); // подключаю логер запросов

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email(),
    password: Joi.string().alphanum(),
  }),
}), login); // логин

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(200),
    avatar: Joi.string().pattern(urlRegEx).message('The url is incorrect'),
    email: Joi.string().email(),
    password: Joi.string().alphanum().min(2).max(50),
  }),
}), createUser); // регистрация

app.use(auth); // мидлвар авторизации

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('/', notFoundRouter);

app.use(errorLogger); // подключаю логер ошибок

// обработчики ошибок:
// обработчик ошибок, сгенерированных celebrate
app.use(errors());

// мой мидлвар - централизованный обработчик ошибок
app.use(errorHandler);

// Подключаюсь к базе данных:
const connect = async () => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(MONGO_URL as string);
  console.log('Connected to the database');

  await app.listen(PORT);
  console.log(`App listening on port ${PORT}`);
};

connect();
