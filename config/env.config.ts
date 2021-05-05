import { cleanEnv, str } from "envalid";
import { config } from "dotenv";
config();

export const ENV = {
  MONGO_URI: process.env.MONGO_URI,
};

(() =>
  cleanEnv(ENV, {
    MONGO_URI: str(),
  }))();
