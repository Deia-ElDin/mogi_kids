import { Document, Schema, models, model, Types } from "mongoose";
import { isValidString } from "@/lib/utils";
import User from "./user.model";
import Review from "./review.model";

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

CommentSchema.pre<IComment>("save", async function (next) {
  const fieldsToValidate: { key: string; value: any }[] = [
    { key: "comment", value: this.comment },
    // { key: "review", value: this.review },
    { key: "likes", value: this.likes },
    { key: "dislikes", value: this.dislikes },
  ];

  let isError = false;

  console.log("fieldsToValidate", fieldsToValidate);

  for (const { key, value } of fieldsToValidate) {
    if (isError) break;
    switch (key) {
      case "comment":
        if (!isValidString(value, 1000)) {
          console.log("comment value", value);
          isError = true;
        }
        break;
      // case "review":
      //   try {
      //     const review = await Review.findById(value);
      //     if (!review) {
      //       console.log("review value", value);
      //       isError = true;
      //     }
      //   } catch (error) {
      //     isError = true;
      //   }
      //   break;
      case "likes":
      case "dislikes":
        if (Array.isArray(value) && value.length > 0) {
          console.log("likes  dislikes value", value);
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
    next(new Error("Invalid Form."));
  } else {
    next();
  }
});

async function validateUsers(userIds: string[]): Promise<boolean> {
  try {
    console.log("userIds", userIds);
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
