import { Document, model, Schema, Model } from "mongoose";

interface TokenData {
  token: string;
  expiresIn: number;
}

interface DataStoredInToken {
  _id: string;
}

export enum UsersRoutes {
  REGISTER = "/register",
  LOGIN = "/login",
}

export interface User {
  name: string;
  email: string;
  password: string;
}

export type UserDocument = User & Document;

const postSchema = new Schema<UserDocument, Model<UserDocument>>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export const UserModel = model("User", postSchema);
