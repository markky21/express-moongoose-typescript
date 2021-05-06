import { Document, model, Model, Schema } from "mongoose";
import { MongoDBSchema } from "../../config/mongodb.config";
import { Post, PostPopulated } from "./posts.model";

const postSchema = new Schema<PostDocument, Model<PostDocument>>({
  author: {
    ref: MongoDBSchema.USER,
    type: Schema.Types.ObjectId,
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

// Methods and Virtuals

export type PostDocument = Post & Document;
export type PostPopulatedDocument = PostPopulated & Document;

// Static methods
export interface PostsModel extends Model<PostDocument> {
  findAllPopulated(): Promise<PostPopulatedDocument[]>;
  findByIdPopulated(id: string): Promise<PostPopulatedDocument>;
}

postSchema.statics.findAllPopulated = async function (
  this: Model<PostDocument>
) {
  return this.find().populate("author", "-password");
};

postSchema.statics.findByIdPopulated = async function (
  this: Model<PostDocument>,
  id: string
) {
  return this.findById(id).populate("author", "-password");
};

// model export
export const postModel = model<PostDocument, PostsModel>(
  MongoDBSchema.POST,
  postSchema
);
