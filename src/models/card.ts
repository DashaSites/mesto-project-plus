import {
  Model,
  Schema,
  model,
  Document,
} from "mongoose";
import validator from "validator";
import NotFoundError from "../errors/not-found-error";
import ForbiddenError from "../errors/forbidden-error";

// Описание схемы карточки
interface ICard {
  name: string;
  link: string;
  owner: Schema.Types.ObjectId;
  likes: Schema.Types.ObjectId[];
  createdAt: Date;
}

interface CardModel extends Model<ICard> {
  checkAndDeleteCard: (
    name: string,
    link: string
  ) => Promise<Document<unknown, any, ICard>>;
}

const cardSchema = new Schema<ICard>(
  {
    name: {
      // у карточки есть имя — опишем требования к имени в схеме:
      type: String,
      required: [true, "A value for this field is required"],
      minlength: 2,
      maxlength: 30,
    },
    link: {
      type: String,
      required: [true, "A value for this field is required"],
      validate: {
        validator(v: string) {
          return validator.isURL(v);
        },
        message: 'The url is not correct', // выводится в случае false
      },
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "A value for this field is required"],
    },
    likes: {
      type: [{ type: Schema.Types.ObjectId, ref: "user" }],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

cardSchema.static(
  "checkAndDeleteCard",
  async function checkAndDeleteCard(cardId: string, currentUserId: string) {
    const card: ICard = await this.findById(cardId);
    if (!card) {
      throw new NotFoundError('Card was not found');
    }
    if (String(card.owner) !== currentUserId) {
      throw new ForbiddenError('You are not permitted to delete this card');
    }
    return this.findByIdAndDelete(card);
  },
);

// Создаю на основе схемы модель, чтобы превратить заготовку в документ
export default model<ICard, CardModel>("card", cardSchema);
