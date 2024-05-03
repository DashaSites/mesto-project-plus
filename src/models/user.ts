import { Schema, model } from 'mongoose';
import validator from 'validator';

// Здесь описание схемы пользователя

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string,
  password: string
}

const userSchema = new Schema<IUser>({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    minlength: 2,
    maxlength: 30,
    default: 'Дед Пихто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: [true, 'A value for this field is required'],
    unique: true,
    validate: {
      validator(v: string) { // validator - функция проверки данных. v - значение свойства email
        validator.isEmail(v); // если введенное значение не пройдет тест, вернется false
      },
      message: 'The email address you entered is not correct', // выводится в случае false
    },
  },
  password: {
    type: String,
    required: [true, 'A value for this field is required'],
    // select: false,
  },
}, {
  versionKey: false,
  timestamps: true,
});

// Создаю на основе схемы модель, чтобы превратить заготовку в документ
export default model<IUser>('user', userSchema);
