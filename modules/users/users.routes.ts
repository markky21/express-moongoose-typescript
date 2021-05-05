import express from "express";
import { UsersRoutes } from "./users.model";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { UserLoginDto } from "./DTOs/UserLogin.dto";
import passport from "passport";
import jwt from "jsonwebtoken";

import "./passport.service";
import { UserDto } from "./DTOs/User.dto";

export const usersRouter = express.Router();

usersRouter.post(
  UsersRoutes.REGISTER,
  validationMiddleware(UserDto),
  passport.authenticate("register"),
  async (req: express.Request, res: express.Response) => {
    res.json({
      message: "Register successful",
      user: req.user,
    });
  }
);

usersRouter.post(
  UsersRoutes.LOGIN,
  validationMiddleware(UserLoginDto),
  passport.authenticate("login"),
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    res.json({
      message: "Login successful",
      user: req.user,
    });
  }
);

usersRouter.get("/logout", (req: express.Request, res: express.Response) => {
  req.logout();
  res.redirect("/");
});
