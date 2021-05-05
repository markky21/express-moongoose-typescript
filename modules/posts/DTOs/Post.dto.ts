import { IsNotEmpty, IsString } from "class-validator";
import { Post } from "../posts.model";

export class PostDto implements Post {
  @IsNotEmpty()
  @IsString()
  public author: string;

  @IsNotEmpty()
  @IsString()
  public content: string;

  @IsNotEmpty()
  @IsString()
  public title: string;
}
