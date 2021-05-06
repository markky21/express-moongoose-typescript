import mongoose from "mongoose";
import { ENV } from "./env.config";

export function initDatabase(): void {
  // @ts-ignore
  mongoose.Promise = global.Promise;
  mongoose.connect(ENV.MONGO_URI as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  });
}

export enum MongoDBSchema {
  USER = "User",
  POST = "Post",
}
