import { Document, Schema, models, model } from "mongoose";

export interface IComment extends Document {
  _id: string;
  comment: string;
  review: { _id: string };
  createdBy: { _id: string };
}

const CommentSchema = new Schema<IComment>(
  {
    comment: { type: String, trim: true },
    review: { type: Schema.Types.ObjectId, ref: "Review" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Comment = models.Comment || model<IComment>("Comment", CommentSchema);

export default Comment;
