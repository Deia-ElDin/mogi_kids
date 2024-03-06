import { Document, Schema, models, model, Types } from "mongoose";
import { IComment } from "./comment.model";

export interface IReview extends Document {
  _id: string;
  review?: string;
  rating?: string;
  comments: IComment[] | [];
  likes: Types.ObjectId[];
  dislikes: Types.ObjectId[];
  edited: boolean;
  blocked: boolean;
  createdBy: Types.ObjectId | string;
  createdAt: string;
  updatedAt: string;
}

const ReviewSchema = new Schema<IReview>(
  {
    review: { type: String, trim: true },
    rating: { type: String, default: "0" },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    edited: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Review = models.Review || model<IReview>("Review", ReviewSchema);

export default Review;
