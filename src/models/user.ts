import mongoose from 'mongoose';

const { Schema } = mongoose;

// Здесь будет описание схемы пользователя

interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new Schema<IUser>({
  name: { // у пользователя есть имя — опишем требования к имени в схеме:
    type: String, // имя — это строка
    required: true, // имя — обязательное поле
    minlength: 2,
    maxlength: 200,
  },
  about: {
    type: String, // about — это строка
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: true,
  },
});

// Создаю на основе схемы модель, чтобы превратить заготовку в документ
export default mongoose.model<IUser>('user', userSchema);
