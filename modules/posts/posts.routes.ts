import express from "express";
import { PostsRoutes } from "./posts.model";
import { postNotFoundException } from "./posts.exceptions";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { PostDto } from "./DTOs/Post.dto";
import passport from "passport";
import { postModel } from "./posts.schema";

export const postsRouter = express.Router();

postsRouter.get(
  PostsRoutes.ROOT,
  async (req: express.Request, res: express.Response) => {
    const posts = await postModel.findAllPopulated();
    res.send(posts);
  }
);

postsRouter.get(
  PostsRoutes.GET_BY_ID,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const postId: string = req.params.id;
    const post = await postModel
      .findByIdPopulated(postId)
      .catch(() => next(postNotFoundException(postId)));
    res.send(post);
  }
);

postsRouter.patch(
  PostsRoutes.MODIFY,
  validationMiddleware(PostDto, { skipMissingProperties: true }),
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const postId: string = req.params.id;
    const postData: PostDto = req.body;
    const post = await postModel
      .findByIdAndUpdate(postId, postData, { new: true })
      .catch(() => next(postNotFoundException(postId)));
    res.send(post);
  }
);

postsRouter.delete(
  PostsRoutes.DELETE,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const postId: string = req.params.id;
    const post = await postModel
      .findByIdAndDelete(postId)
      .catch(() => next(postNotFoundException(postId)));
    if (post) {
      res.send(200);
    } else {
      res.send(404);
    }
  }
);

postsRouter.post(
  PostsRoutes.CREATE,
  validationMiddleware(PostDto),
  passport.authenticate("jwt", { session: false }),
  async (req: express.Request, res: express.Response) => {
    const postData: PostDto = req.body;
    const post = await new postModel({
      ...postData,
      author: req.user!._id,
    }).save();
    res.send(post);
  }
);
