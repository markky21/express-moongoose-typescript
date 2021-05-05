import "reflect-metadata";
import cookieParser from "cookie-parser";
import createError from "http-errors";
import express from "express";
import session from "express-session";
import logger from "morgan";
import passport from "passport";
import { NextFunction, Request, Response } from "express-serve-static-core";
import { initDatabase } from "./config/mongodb.config";
import { Routes } from "./app.model";
import { postsRouter } from "./modules/posts/posts.routes";
import { errorMiddleware } from "./middlewares/httpException.middlaware";
import { usersRouter } from "./modules/users/users.routes";
import { ENV } from "./config/env.config";

initDatabase();
export const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: ENV.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: ENV.NODE_ENV === "production" },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(Routes.POSTS, postsRouter);
app.use(Routes.USERS, usersRouter);

// catch 404 and forward to error handler
app.use(function (err: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

app.use(errorMiddleware);
