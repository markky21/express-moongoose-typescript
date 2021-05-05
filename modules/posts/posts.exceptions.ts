import { HttpException } from "../../utils/exceptions.utils";

export const postNotFoundException = (postId: string) =>
  new HttpException(404, `Post with id ${postId} not found`);
