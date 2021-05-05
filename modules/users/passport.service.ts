import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  checkPasswordMatching,
  findUserByEmail,
  registerUser,
} from "./users.service";
import {
  userWithThatEmailAlreadyExistsException,
  wrongCredentialsException,
} from "./users.exceptions";
import express from "express";

passport.use(
  "login",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (email, password, done) => {
      findUserByEmail(email)
        .then((u) => u?.toObject())
        .then(async (user) => {
          if (!user) {
            return done(wrongCredentialsException(), false);
          }

          const isPasswordMatching = await checkPasswordMatching(
            password,
            user.password as string
          );

          if (!isPasswordMatching) {
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
      const { email: e, password: p, ...userData } = req.body;
      findUserByEmail(email)
        .then((u) => u?.toObject())
        .then(async (user) => {
          if (user) {
            return done(userWithThatEmailAlreadyExistsException(email), false);
          }

          registerUser({
            email,
            password,
            name: email,
            ...userData,
          }).then((user) => done(null, user));
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
