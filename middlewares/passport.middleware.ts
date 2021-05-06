import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  Strategy as JWTStrategy,
  ExtractJwt as ExtractJWT,
} from "passport-jwt";
import {
  userWithThatEmailAlreadyExistsException,
  wrongCredentialsException,
} from "../modules/users/users.exceptions";
import { UserDto } from "../modules/users/DTOs/User.dto";
import { ENV } from "../config/env.config";
import { UserDocument, userModel } from "../modules/users/users.schema";

declare global {
  namespace Express {
    interface User extends UserDocument {}
  }
}

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, done): void => {
      userModel
        .findUserByEmail(email)
        .then(async (user) => {
          if (!user) {
            return done(wrongCredentialsException(), false);
          }

          if (!(await user.isValidPassword(password))) {
            return done(wrongCredentialsException(), false);
          }

          return done(null, user);
        })
        .catch((err) => done(err));
    }
  )
);

passport.use(
  "register",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const userData: UserDto = req.body;
      userModel
        .findUserByEmail(email)
        .then(async (user) => {
          if (user) {
            return done(userWithThatEmailAlreadyExistsException(email), false);
          }

          await userModel
            .create(userData)
            .then((u) => u.toObject())
            .then(({ password, ...user }) => user)
            .then((user) => done(null, user));
        })
        .catch((err) => done(err));
    }
  )
);

passport.serializeUser(function (user: Express.User, done) {
  done(null, user);
});

passport.deserializeUser(function (user: Express.User, done) {
  done(null, user);
});

passport.use(
  new JWTStrategy(
    {
      secretOrKey: ENV.JWT_SECRET,
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (error) {
        done(error);
      }
    }
  )
);
