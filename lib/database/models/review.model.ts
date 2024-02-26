import { Document, Schema, models, model } from "mongoose";
import { IComment } from "./comment.model";

export interface IReview extends Document {
  _id: string;
  review?: string;
  rating?: string;
  comments: IComment[] | [];
  createdBy: { _id: string };
}

const ReviewSchema = new Schema<IReview>(
  {
    review: { type: String, trim: true },
    rating: String,
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Review = models.Review || model<IReview>("Review", ReviewSchema);

export default Review;
