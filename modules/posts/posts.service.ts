import { PostDocument, PostModel } from "./posts.model";
import { PostDto } from "./DTOs/Post.dto";

export function createPost(post: PostDto): Promise<PostDocument> {
  const createdPost = new PostModel(post);
  return createdPost.save();
}

export function getAllPosts(): Promise<PostDocument[]> {
  return PostModel.find().then((posts) => posts);
}

export function getPostById(postId: string): Promise<PostDocument | null> {
  return PostModel.findById(postId).then((post) => post);
}

export function modifyPost(
  postId: string,
  postData: PostDto
): Promise<PostDocument | null> {
  return PostModel.findByIdAndUpdate(postId, postData, { new: true }).then(
    (post) => post
  );
}

export function deletePost(postId: string): Promise<PostDocument | null> {
  return PostModel.findByIdAndDelete(postId).then((result) => result);
}
