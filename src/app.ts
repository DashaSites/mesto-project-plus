import express from 'express';
import mongoose from 'mongoose';
// import { MongoClient } from 'mongodb';
// import { User } from './database/User';
import bodyParser from 'body-parser';
import cardRouter from './routes/cards';
import userRouter from './routes/users';

console.log('hi-1');

const app = express();
const { PORT = 3000 } = process.env;

app.use(bodyParser.json());

app.use('/users', userRouter);

app.use('/cards', cardRouter);

// Подключаюсь к базе данных:
const connect = async () => {
  mongoose.set('strictQuery', true);
  await mongoose.connect('mongodb://127.0.0.1:27017/mestodb');
  console.log('Connected to the database');

  await app.listen(PORT);
  console.log(`App listening on port ${PORT}`);
};

connect();

// Подключить роуты

// User.create({ firstName: 'foo', lastName: 'bar', username: 'testUser' });

// NewUser.create({ name: 'Дед Пихто', about: 'Кот ученый', avatar: 'testUser' });

console.log('hi-3');
