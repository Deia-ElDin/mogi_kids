import { Document, Schema, models, model, Types } from "mongoose";
import { commentsErrs } from "@/constants/errors";
import User from "./user.model";

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

const { comment } = commentsErrs;

const CommentSchema = new Schema<IComment>(
  {
    comment: {
      type: String,
      trim: true,
      required: [true, comment.errs.min],
      maxlength: [comment.length.max, comment.errs.max],
    },
    review: { type: Schema.Types.ObjectId, ref: "Review", immutable: true },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    edited: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", immutable: true },
  },
  { timestamps: true }
);

CommentSchema.pre<IComment>("save", async function (next) {
  const fieldsToValidate: { key: string; value: any }[] = [
    { key: "review", value: this.review },
    { key: "likes", value: this.likes },
    { key: "dislikes", value: this.dislikes },
    { key: "createdBy", value: this.createdBy },
  ];

  let isError = false;

  for (const { key, value } of fieldsToValidate) {
    if (isError) break;

    switch (key) {
      case "likes":
      case "dislikes":
        if (Array.isArray(value) && value.length > 0) {
          if (!(await validateUsers(value))) isError = true;
        } else if (!Array.isArray(value)) isError = true;
        break;

      case "createdBy":
        try {
          const user = await User.findById(value);
          if (!user) isError = true;
        } catch (error) {
          console.error("Error finding user:", error);
          isError = true;
        }
        break;
    }
  }

  if (isError) {
    next(new Error("Seriously Dude!!!!"));
  } else {
    next();
  }
});

async function validateUsers(userIds: string[]): Promise<boolean> {
  try {
    for (const userId of userIds) {
      const user = await User.findById(userId);
      if (!user) {
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error("Error finding user:", error);
    return false;
  }
}

const Comment = models.Comment || model<IComment>("Comment", CommentSchema);

export default Comment;
