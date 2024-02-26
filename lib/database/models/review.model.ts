import { Document, Schema, models, model, Types } from "mongoose";
import { IUser } from "./user.model";
import { IComment } from "./comment.model";

export interface IReview extends Document {
  _id: string;
  review?: string;
  rating?: string;
  comments: IComment[] | [];
  createdBy: Types.ObjectId | string;
  likes: Types.ObjectId[];
  dislikes: Types.ObjectId[];
  createdAt: string;
  updatedAt: string;
}

const ReviewSchema = new Schema<IReview>(
  {
    review: { type: String, trim: true },
    rating: String,
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Review = models.Review || model<IReview>("Review", ReviewSchema);

export default Review;
