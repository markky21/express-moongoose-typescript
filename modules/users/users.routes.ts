import express from "express";
import { UsersRoutes } from "./users.model";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { UserLoginDto } from "./DTOs/UserLogin.dto";
import passport from "passport";
import jwt from "jsonwebtoken";

import "../../middlewares/passport.middleware";
import { UserDto } from "./DTOs/User.dto";
import { ENV } from "../../config/env.config";
import { UserDocument } from "./users.schema";

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
    const user: UserDocument = req.user as UserDocument;
    req.login(user, { session: false }, async (error) => {
      if (error) return next(error);

      const body = { _id: user._id, email: user.email };
      const token = jwt.sign({ user: body }, ENV.JWT_SECRET);

      return res.json({ token });
    });
  }
);

usersRouter.get(
  UsersRoutes.LOGOUT,
  (req: express.Request, res: express.Response) => {
    req.logout();
    res.json("OK");
  }
);

usersRouter.get(
  UsersRoutes.PROFILE,
  passport.authenticate("jwt", { session: false }),
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.log(req.user, req.query);

    res.json({
      message: "You made it to the secure route",
      user: req.user,
      token: req.query.secret_token,
    });
  }
);
