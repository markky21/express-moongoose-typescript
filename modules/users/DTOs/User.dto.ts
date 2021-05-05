import { IsNotEmpty, IsString } from "class-validator";
import { User } from "../users.model";

export class UserDto implements User {
  @IsNotEmpty()
  @IsString()
  public email: string;

  @IsNotEmpty()
  @IsString()
  public password: string;

  @IsNotEmpty()
  @IsString()
  public name: string;
}
