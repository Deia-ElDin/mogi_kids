"use server";

import { connectToDb } from "../database";
import { CreateReviewParams, UpdateReviewParams, LikesParams } from "@/types";
import { handleError } from "../utils";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongoose";
import { populateUser } from "./user.actions";
import User, { IUser } from "../database/models/user.model";
import Review, { IReview } from "../database/models/review.model";
import Comment from "../database/models/comment.model";

type GetAllResult = {
  success: boolean;
  data: IReview[] | null;
  error: string | null;
};

type DefaultResult = {
  success: boolean;
  data: IUser | null;
  error: string | null;
};

type LikesResult = {
  success: boolean;
  data: boolean | null;
  error: string | null;
};

type DeleteResult = {
  success: boolean;
  data: null;
  error: string | null;
};

const populateReview = (query: any) => {
  return query
    .populate({
      path: "createdBy",
      model: "User",
      select: "_id firstName lastName photo",
    })
    .populate({
      path: "comments",
      model: Comment,
      populate: {
        path: "createdBy",
        model: "User",
        select: "_id firstName lastName photo",
      },
    });
};

export async function getAllReviews(): Promise<GetAllResult> {
  try {
    await connectToDb();

    const reviews = await Review.find()
      .populate({
        path: "createdBy",
        model: "User",
        select: "_id firstName lastName photo",
      })
      .populate({
        path: "comments",
        model: Comment,
        populate: {
          path: "createdBy",
          model: "User",
          select: "_id firstName lastName photo",
        },
      });

    revalidatePath("/");

    const data = JSON.parse(JSON.stringify(reviews));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function createReview(
  params: CreateReviewParams
): Promise<DefaultResult> {
  const { createdBy, review, rating, path } = params;

  try {
    await connectToDb();

    const createdReview = await Review.create({
      review,
      rating,
      createdBy,
    });

    if (!createdReview) throw new Error("Failed to create user review.");

    const user = await populateUser(
      User.findByIdAndUpdate(
        createdBy,
        { $addToSet: { reviews: createdReview._id } },
        { new: true }
      )
    );

    if (!user) throw new Error("User not found.");

    revalidatePath(path);

    const data = JSON.parse(JSON.stringify(user));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function updateReviewLikes(
  params: LikesParams
): Promise<LikesResult> {
  const { reviewId, updaterId, path } = params;

  try {
    await connectToDb();

    const review = await Review.findById(reviewId);

    if (!review) throw new Error("Review not found.");

    const likesIndex = review.likes.findIndex(
      (id: ObjectId) => id.toString() === updaterId
    );

    const dislikesIndex = review.dislikes.findIndex(
      (id: ObjectId) => id.toString() === updaterId
    );

    if (dislikesIndex !== -1) review.dislikes.splice(dislikesIndex, 1);

    if (likesIndex !== -1) review.likes.splice(likesIndex, 1);
    else review.likes.push(updaterId);

    const updatedReview = await review.save();

    if (!updatedReview) throw new Error("Failed to update review likes.");

    // const user = await populateUser(User.findById(review.createdBy));

    // if (!user) throw new Error("User not found.");

    revalidatePath(path);

    console.log("updatedReview.likes = ", updatedReview.likes);

    const index = updatedReview.likes.findIndex(
      (id: ObjectId) => id.toString() === updaterId
    );

    return { success: true, data: index >= 0 ? true : false, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function updateReviewDislikes(
  params: LikesParams
): Promise<LikesResult> {
  const { reviewId, updaterId, path } = params;

  try {
    await connectToDb();

    const review = await Review.findById(reviewId);

    if (!review) throw new Error("Review not found");

    const likesIndex = review.likes.findIndex(
      (id: ObjectId) => id.toString() === updaterId
    );
    const dislikesIndex = review.dislikes.findIndex(
      (id: ObjectId) => id.toString() === updaterId
    );

    if (likesIndex !== -1) review.likes.splice(likesIndex, 1);

    if (dislikesIndex !== -1) review.dislikes.splice(dislikesIndex, 1);
    else review.dislikes.push(updaterId);

    const updatedReview = await review.save();

    if (!updatedReview) throw new Error("Failed to update review dislikes.");

    const index = updatedReview.dislikes.findIndex(
      (id: ObjectId) => id.toString() === updaterId
    );

    revalidatePath(path);

    return { success: true, data: index >= 0 ? true : false, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function updateReview(
  params: UpdateReviewParams
): Promise<DefaultResult> {
  const { _id, review, rating, path } = params;

  try {
    await connectToDb();

    const updatedReview = await Review.findByIdAndUpdate(_id, {
      review,
      rating,
    });

    if (!updatedReview) throw new Error("Failed to create user review.");

    const user = await populateUser(User.findById(updatedReview.createdBy));

    revalidatePath(path);

    const data = JSON.parse(JSON.stringify(user));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function deleteReview(
  reviewId: string,
  path: string
): Promise<DefaultResult> {
  try {
    await connectToDb();

    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) throw new Error("Review not found or already deleted.");

    await Promise.all(
      deletedReview.comments.map(async (id: ObjectId) => {
        await Comment.findByIdAndDelete(id);
      })
    );

    const user = await populateUser(
      User.findByIdAndUpdate(
        deletedReview.createdBy,
        { $pull: { reviews: deletedReview._id } },
        { new: true }
      )
    );

    revalidatePath(path);

    const data = JSON.parse(JSON.stringify(user));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

// export async function deleteAllReviews() {
//   try {
//     await connectToDb();

//     const reviews = await Review.find();

//     for (const review of reviews) {
//       await Review.findByIdAndDelete(review._id);
//       await User.findByIdAndUpdate(review.user._id, {
//         $pull: { reviews: review._id },
//       });
//     }

//     revalidatePath("/");

//     return "All reviews deleted successfully";
//   } catch (error) {
//         return { success: false, data: null, error: handleError(error) };

//   }
// }
