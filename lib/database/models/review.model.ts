import { Document, Schema, models, model } from "mongoose";

export interface IReview extends Document {
  _id: string;
  review: string;
  rating: string;
}
