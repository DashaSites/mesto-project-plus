import {
  Model,
  Schema,
  model,
  Document,
} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import UnauthorizedError from '../errors/authorization-error';

// Здесь описание схемы пользователя

interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string,
  password: string
}

interface UserModel extends Model<IUser> {
  findUserByCredentials: (email: string, password: string) => Promise<Document<unknown, any, IUser>>
}

const userSchema = new Schema<IUser, UserModel>({
  name: {
    type: String,
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
    validate: {
      validator(v: string) { // validator - функция проверки данных. v - значение свойства avatar
        return validator.isURL(v); // если введенное значение не пройдет тест, вернется false
      },
      message: 'The url is not correct', // выводится в случае false
    },
  },
  email: {
    type: String,
    required: [true, 'A value for this field is required'],
    unique: true,
    validate: {
      validator(v: string) {
        return validator.isEmail(v);
      },
      message: 'The email address you entered is not correct',
    },
  },
  password: {
    type: String,
    required: [true, 'A value for this field is required'],
    select: false,
  },
}, {
  versionKey: false,
  timestamps: true,
});

userSchema.static('findUserByCredentials', async function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('We were not able to authenticate you. Please check you gave proper email and password');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('We were not able to authenticate you. Please check you gave proper email and password');
          }

          return user; // теперь user доступен
        });
    });
});

// Создаю на основе схемы модель, чтобы превратить заготовку в документ
export default model<IUser, UserModel>('user', userSchema);
