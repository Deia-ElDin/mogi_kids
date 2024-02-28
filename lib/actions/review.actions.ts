"use server";

import { connectToDb } from "../database";
import { CreateReviewParams, UpdateReviewParams } from "@/types";
import { handleError } from "../utils";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongoose";
import User from "../database/models/user.model";
import Review from "../database/models/review.model";
import Comment from "../database/models/comment.model";

export async function getAllReviews() {
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

    return JSON.parse(JSON.stringify(reviews));
  } catch (error) {
    handleError(error);
  }
}

export async function createReview(params: CreateReviewParams) {
  const { createdBy, review, rating } = params;

  try {
    await connectToDb();

    const createdReview = await Review.create({
      review,
      rating,
      createdBy,
    });

    if (!createdReview) throw new Error("Failed to create user review.");

    const dbUser = await User.findByIdAndUpdate(
      createdBy,
      { $addToSet: { reviews: createdReview._id } },
      { new: true }
    );

    if (!dbUser) throw new Error("User not found.");

    // revalidatePath(`/users/${user._id}`);
    revalidatePath("/");

    return JSON.parse(JSON.stringify(createdReview));
  } catch (error) {
    handleError(error);
  }
}

export async function updateReview(params: UpdateReviewParams) {
  const { _id, review, rating } = params;

  console.log("params = ", params);

  try {
    await connectToDb();

    const updatedReview = await Review.findByIdAndUpdate(_id, {
      review,
      rating,
    });

    if (!updatedReview) throw new Error("Failed to create user review.");

    // revalidatePath(`/users/${updatedReview.createdBy}`);
    revalidatePath("/");
    return JSON.parse(JSON.stringify(updatedReview));
  } catch (error) {
    handleError(error);
  }
}

export async function deleteReview(reviewId: string) {
  try {
    await connectToDb();

    const deleteReview = await Review.findByIdAndUpdate(reviewId);

    if (!deleteReview) throw new Error("Review not found or already deleted.");

    const dbUser = await User.findByIdAndUpdate(
      deleteReview.user._id,
      { $pull: { reviews: deleteReview._id } },
      { new: true }
    );

    revalidatePath(`/users/${dbUser._id}`);

    return "Review deleted successfully";
  } catch (error) {
    handleError(error);
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
//     handleError(error);
//   }
// }

export async function deleteUserReview(userId: string) {
  try {
    await connectToDb();

    const user = await User.findById(userId);

    if (!user) throw new Error("Failed to find the user.");

    const reviewIds: ObjectId[] = user.reviews;

    await Promise.all(
      reviewIds.map((reviewId) => Review.findByIdAndDelete(reviewId))
    );

    user.reviews = [];
    await user.save();

    revalidatePath("/");

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

export async function updateReviewLikes(reviewId: string, updaterId: string) {
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

    if (dislikesIndex !== -1) review.dislikes.splice(dislikesIndex, 1);

    if (likesIndex !== -1) review.likes.splice(likesIndex, 1);
    else review.likes.push(updaterId);

    const updatedReview = await review.save();

    if (!updatedReview) throw new Error("Failed to update review likes.");

    revalidatePath("/");

    return JSON.parse(JSON.stringify(updatedReview));
  } catch (error) {
    handleError(error);
  }
}

export async function updateReviewDislikes(
  reviewId: string,
  updaterId: string
) {
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

    revalidatePath("/");

    return JSON.parse(JSON.stringify(updatedReview));
  } catch (error) {
    handleError(error);
  }
}
