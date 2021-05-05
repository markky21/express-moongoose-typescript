import { Document, Model, model, Schema } from "mongoose";

export enum PostsRoutes {
  ROOT = "/",
  GET_BY_ID = "/:id",
  MODIFY = "/:id",
  DELETE = "/:id",
  CREATE = "/",
}

export interface Post {
  author: string;
  content: string;
  title: string;
}

export type PostDocument = Post & Document;

const postSchema = new Schema<PostDocument, Model<PostDocument>>({
  author: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

export const PostModel = model("Post", postSchema);
