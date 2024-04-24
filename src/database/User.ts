// I usually like create this file in a database folder
import mongoose, { Document, Model } from 'mongoose';

const { Schema } = mongoose;

// creating the actual mongoose schema
export const UserSchema = new Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    username: {
      type: String,
    },
    lang: {
      type: String,
      default: 'it',
    },
  },
  { timestamps: true },
);

// exporting the type in order to have all the correct linting
export interface IUser extends Document {
  id: string;
  firstName: string;
  lastName?: string;
  username?: string;
  createdAt: Date | number;
  updatedAt: Date | number;
}

// registering in mongoose models the schema with the relative interface
export const User = (mongoose.models.User as Model<IUser>)
  || mongoose.model<IUser>('User', UserSchema);
