import { Document, Schema, models, model } from "mongoose";
import { IComment } from "./comment.model";

export interface IReview extends Document {
  _id: string;
  review?: string;
  rating?: string;
  user: { _id: string };
  comments: IComment[] | [];
}

const ReviewSchema = new Schema<IReview>({
  review: { type: String, trim: true },
  rating: String,
  user: { type: Schema.Types.ObjectId, ref: "User" },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});


const Review = models.Review || model<IReview>("Review", ReviewSchema);

export default Review;
