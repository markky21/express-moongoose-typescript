import { HttpException } from "../../utils/exceptions.utils";

export const userWithThatEmailAlreadyExistsException = (email: string) =>
  new HttpException(409, `User with email ${email} exist`);

export const wrongCredentialsException = () =>
  new HttpException(403, `Email or password are wrong`);
