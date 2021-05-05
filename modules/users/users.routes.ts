import express from "express";
import { UsersRoutes } from "./users.model";
import {
  checkPasswordMatching,
  findUserByEmail,
  registerUser,
} from "./users.service";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { UserDto } from "./DTOs/User.dto";
import {
  userWithThatEmailAlreadyExistsException,
  wrongCredentialsException,
} from "./users.exceptions";
import { UserLoginDto } from "./DTOs/UserLogin.dto";

export const usersRouter = express.Router();

usersRouter.post(
  UsersRoutes.REGISTER,
  validationMiddleware(UserDto),
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const userData: UserDto = req.body;
    const user = await findUserByEmail(userData.email);

    if (user) {
      next(userWithThatEmailAlreadyExistsException(userData.email));
    } else {
      const newUser = await registerUser(userData);
      res.send(newUser);
    }
  }
);

usersRouter.post(
  UsersRoutes.LOGIN,
  validationMiddleware(UserLoginDto),
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const userData: UserLoginDto = req.body;
    const { password, ...user } =
      (await findUserByEmail(userData.email).then((u) => u?.toObject())) || {};

    if (!(user && password)) return next(wrongCredentialsException());

    const isPasswordMatching = await checkPasswordMatching(
      userData.password,
      password as string
    );

    if (isPasswordMatching) return res.send(user);

    next(wrongCredentialsException());
  }
);
