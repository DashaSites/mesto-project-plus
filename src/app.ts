import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { MongoClient } from 'mongodb';
import { User, UserSchema } from './database/User';

console.log('hi-1');

// const getDataBase = async () => {
//   const client = new MongoClient('mongodb://localhost:27017/');
//   await client.connect();
//   /* Получаю доступ к нужной базе данных */
//   const mestodb = client.db('mestodb');
//   console.log('hi-2');

//   return mestodb;
// };

// getDataBase();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

User.create({ firstName: 'foo', lastName: 'bar', username: 'testUser' });

// async function addUser() {
// const newUser =
// await new UserModel({ firstName: 'foo', lastName: 'bar', username: 'testUser' }).save();
//   return newUser;
// }

// addUser();

console.log('hi-3');

const app = express();

const { PORT = 3000 } = process.env;

// app.listen(PORT);

app.listen(PORT, () => {
  // Если всё работает, консоль покажет, какой порт приложение слушает
  console.log(`App listening on port ${PORT}`)
})
