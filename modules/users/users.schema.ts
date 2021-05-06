import { Document, model, Model, Schema } from "mongoose";
import * as bcrypt from "bcrypt";
import { MongoDBSchema } from "../../config/mongodb.config";
import { User } from "./users.model";

const userSchema = new Schema<UserDocument, Model<UserDocument>>({
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

// Methods and Virtuals

export interface UserDocument extends User, Document {
  isValidPassword(password: string): Promise<boolean>;
}

userSchema.methods.isValidPassword = async function (
  password
): Promise<boolean> {
  const user = this;
  return await bcrypt.compare(password, user.password);
};

// Static methods
export interface UserModel extends Model<UserDocument> {
  findUserByEmail(email: string): Promise<UserDocument>;
}

userSchema.statics.findUserByEmail = async function (
  this: Model<UserDocument>,
  email: string
) {
  return this.findOne({ email });
};

// Document middlewares
userSchema.pre("save", async function (next): Promise<void> {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// model export
export const userModel = model<UserDocument, UserModel>(
  MongoDBSchema.USER,
  userSchema
);
