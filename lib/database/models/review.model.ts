import { Document, Schema, models, model, Types } from "mongoose";
import { IComment } from "./comment.model";
import { reviewErrs } from "@/constants/errors";
import { isInRange } from "@/lib/utils";
import User from "./user.model";
import Comment from "./comment.model";

export interface IReview extends Document {
  _id: string;
  review: string;
  rating?: string;
  comments: IComment[] | [];
  likes: Types.ObjectId[];
  dislikes: Types.ObjectId[];
  edited: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: Types.ObjectId | string;
}

const { review, rating } = reviewErrs;

const ReviewSchema = new Schema<IReview>(
  {
    review: {
      type: String,
      trim: true,
      required: [true, review.errs.min],
      maxlength: [review.length.max, review.errs.max],
    },
    rating: {
      type: String,
      default: "0",
      maxlength: [rating.length.max, rating.errs.max],
      validate: [
        {
          validator: function (value: string) {
            return isInRange(
              parseInt(value),
              rating.values.min,
              rating.values.max
            );
          },
          message: rating.errs.range,
        },
      ],
    },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    edited: { type: Boolean, default: false },
    blocked: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", immutable: true },
  },
  { timestamps: true }
);

ReviewSchema.pre<IReview>("save", async function (next) {
  const fieldsToValidate: { key: string; value: any }[] = [
    { key: "comments", value: this.comments },
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

      case "comments":
        if (Array.isArray(value) && value.length > 0) {
          if (!(await validateComments(value))) isError = true;
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
      if (!user) return false;
    }
    return true;
  } catch (error) {
    console.error("Error finding user:", error);
    return false;
  }
}

async function validateComments(commentIds: string[]): Promise<boolean> {
  try {
    for (const commentId of commentIds) {
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return false;
      }
    }
    return true;
  } catch (error) {
    console.error("Error finding comment:", error);
    return false;
  }
}

const Review = models.Review || model<IReview>("Review", ReviewSchema);

export default Review;
