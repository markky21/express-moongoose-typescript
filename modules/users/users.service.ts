import { User, UserDocument, UserModel } from "./users.model";
import { UserDto } from "./DTOs/User.dto";
import * as bcrypt from "bcrypt";

export function findUserByEmail(email: string): Promise<UserDocument | null> {
  return UserModel.findOne({ email }).then((user) => user);
}

export async function registerUser(
  userData: UserDto
): Promise<Omit<User, "password">> {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const { password, ...user } = await UserModel.create({
    ...userData,
    password: hashedPassword,
  }).then((u) => u.toObject());
  return user;
}

export async function checkPasswordMatching(
  password: string,
  hashPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashPassword);
}
