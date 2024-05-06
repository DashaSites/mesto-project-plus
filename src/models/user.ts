import {
  Model,
  Schema,
  model,
  Document,
} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

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
    select: false,
  },
}, {
  versionKey: false,
  timestamps: true,
});

// добавим метод findUserByCredentials схеме пользователя
// у него будет два параметра — почта и пароль
// добавим метод findUserByCredentials схеме пользователя
// у него будет два параметра — почта и пароль
userSchema.static('findUserByCredentials', async function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Wrong email or password'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Wrong email or password'));
          }

          return user; // теперь user доступен
        });
    });
});

// Создаю на основе схемы модель, чтобы превратить заготовку в документ
export default model<IUser, UserModel>('user', userSchema);
