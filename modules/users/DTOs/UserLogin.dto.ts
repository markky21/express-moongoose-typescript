import { IsNotEmpty, IsString } from "class-validator";
import { User } from "../users.model";

export class UserLoginDto implements Pick<User, "email" | "password"> {
  @IsNotEmpty()
  @IsString()
  public email: string;

  @IsNotEmpty()
  @IsString()
  public password: string;
}
