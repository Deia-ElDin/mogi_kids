import { Document, Schema, models, model } from "mongoose";

export interface IComment extends Document {
  _id: string;
  comment: string;
  review: { _id: string };
  user: { _id: string };
}

const CommentSchema = new Schema<IComment>({
  comment: { type: String, trim: true },
  review: { type: Schema.Types.ObjectId, ref: "Review" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
});

const Comment = models.Comment || model<IComment>("Comment", CommentSchema);

export default Comment;
