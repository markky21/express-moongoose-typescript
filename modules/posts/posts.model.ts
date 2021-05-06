import { UserDocument } from "../users/users.schema";

export enum PostsRoutes {
  ROOT = "/",
  GET_BY_ID = "/:id",
  MODIFY = "/:id",
  DELETE = "/:id",
  CREATE = "/",
}

export interface Post {
  author: UserDocument["_id"];
  content: string;
  title: string;
}

export interface PostPopulated {
  author: UserDocument;
  content: string;
  title: string;
}
