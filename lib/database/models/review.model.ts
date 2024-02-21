import { Document, Schema, models, model } from "mongoose";

export interface IReview extends Document {
  _id: string;
  review: string;
  rating: string;
}

const ReviewSchema = new Schema<IReview>({
  review: { type: String, trim: true },
  rating: { type: String, trim: true },
});

const Review = models.Review || model<IReview>("Review", ReviewSchema);

export default Review;
