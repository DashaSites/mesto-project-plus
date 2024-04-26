import { Schema, model } from 'mongoose';

// Описание схемы карточки
interface ICard {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: Schema.Types.ObjectId[];
  createdAt: Date;
}

const cardSchema = new Schema<ICard>({
  name: { // у карточки есть имя — опишем требования к имени в схеме:
    type: String,
    required: [true, 'A value for this field is required'],
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: [true, 'A value for this field is required'],
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: [true, 'A value for this field is required'],
  },
  likes: [{
    type: Schema.Types.ObjectId,
    required: [true, 'A value for this field is required'],
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { versionKey: false });

// Создаю на основе схемы модель, чтобы превратить заготовку в документ
export default model<ICard>('card', cardSchema);
