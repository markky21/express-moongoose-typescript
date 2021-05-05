import express from "express";
import { HttpError } from "http-errors";

export function errorMiddleware(
  error: HttpError,
  request: express.Request,
  response: express.Response,
  next: express.NextFunction
) {
  const status = error.status || 500;
  const message = error.message || "Something went wrong";
  response.status(status).send({
    status,
    message,
  });
}
