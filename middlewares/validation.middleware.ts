import { ClassConstructor, plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import * as express from "express";
import { HttpException } from "../utils/exceptions.utils";
import { ValidatorOptions } from "class-validator/types/validation/ValidatorOptions";

export function validationMiddleware<T extends ClassConstructor<object>>(
  type: T,
  validatorOptions?: ValidatorOptions
): express.RequestHandler {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    validate(plainToClass(type, req.body), validatorOptions).then(
      (errors: ValidationError[]) => {
        if (errors.length > 0) {
          const message = errors
            .map((error: ValidationError) =>
              Object.values(
                error.constraints as {
                  [type: string]: string;
                }
              )
            )
            .join(", ");
          next(new HttpException(400, message));
        } else {
          next();
        }
      }
    );
  };
}
