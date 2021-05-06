export enum UsersRoutes {
  REGISTER = "/register",
  LOGIN = "/login",
  LOGOUT = "/logout",
  PROFILE = "/profile",
}

export interface User {
  name: string;
  email: string;
  password: string;
}
