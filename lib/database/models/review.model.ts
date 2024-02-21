import { Document, Schema, models, model } from "mongoose";

export interface IReview extends Document {
  _id: string;
  review?: string;
  rating?: string;
  user: { _id: string; firstName: string; lastName?: string; photo?: string };
}

const ReviewSchema = new Schema<IReview>({
  review: { type: String, trim: true },
  rating: { type: String, trim: true },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

const Review = models.Review || model<IReview>("Review", ReviewSchema);

export default Review;
