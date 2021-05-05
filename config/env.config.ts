import { cleanEnv, str } from "envalid";
import { config } from "dotenv";
config();

export const ENV = {
  MONGO_URI: process.env.MONGO_URI as string,
  NODE_ENV: (process.env.NODE_ENV as string) || "development",
  SESSION_SECRET: process.env.SESSION_SECRET as string,
};

(() =>
  cleanEnv(ENV, {
    MONGO_URI: str(),
    NODE_ENV: str(),
    SESSION_SECRET: str(),
  }))();
