import express from "express";
import { PostsRoutes } from "./posts.model";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
  modifyPost,
} from "./posts.service";
import { postNotFoundException } from "./posts.exceptions";
import { validationMiddleware } from "../../middlewares/validation.middleware";
import { PostDto } from "./DTOs/Post.dto";

export const postsRouter = express.Router();

postsRouter.get(
  PostsRoutes.ROOT,
  async (req: express.Request, res: express.Response) => {
    const posts = await getAllPosts();
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
    const post = await getPostById(postId).catch(() =>
      next(postNotFoundException(postId))
    );
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
    const post = await modifyPost(postId, postData).catch(() =>
      next(postNotFoundException(postId))
    );
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
    const post = await deletePost(postId).catch(() =>
      next(postNotFoundException(postId))
    );
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
  async (req: express.Request, res: express.Response) => {
    const postData: PostDto = req.body;
    const post = await createPost(postData);
    res.send(post);
  }
);
