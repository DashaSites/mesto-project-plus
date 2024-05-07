import express, {
  json,
} from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import notFoundRouter from './routes/not-found';
import cardRouter from './routes/cards';
import userRouter from './routes/users';
import { createUser, login } from './controllers/users';
import auth from './middlewares/auth';
import { errorLogger, requestLogger } from './middlewares/logger';

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();
app.use(json());
app.use(cookieParser());

// Мидлвар авторизации: временная заглушка для будущей логики авторизации
// app.use((req: Request, res: Response, next: NextFunction) => {
//   req.user = {
//     _id: '662c2971a9308ca534ddc741',
//   };
//   next();
// });

// В app.ts важно сначала подключать мидлвары, а потом подключать те роуты, которые
// используют результаты работы этих мидлваров

app.use(requestLogger); // подключаю логер запросов

app.post('/signin', login); // логин
app.post('/signup', createUser); // регистрация

app.use(auth); // авторизация

app.use('/users', userRouter);
app.use('/cards', cardRouter);
app.use('/', notFoundRouter);

app.use(errorLogger); // подключаю логер ошибок

// Подключаюсь к базе данных:
const connect = async () => {
  mongoose.set('strictQuery', true);
  await mongoose.connect(MONGO_URL as string);
  console.log('Connected to the database');

  await app.listen(PORT);
  console.log(`App listening on port ${PORT}`);
};

connect();
