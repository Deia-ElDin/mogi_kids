import { Document, Schema, models, model, Types } from "mongoose";

export interface IComment extends Document {
  _id: string;
  comment: string;
  review: Types.ObjectId | string;
  likes: Types.ObjectId[];
  dislikes: Types.ObjectId[];
  edited: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: Types.ObjectId | string;
}

const CommentSchema = new Schema<IComment>(
  {
    comment: { type: String, trim: true },
    review: { type: Schema.Types.ObjectId, ref: "Review" },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    edited: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Comment = models.Comment || model<IComment>("Comment", CommentSchema);

export default Comment;
