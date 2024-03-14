"use server";

import { connectToDb } from "../database";
import { getCurrentUser, validateIsTheSameUser } from "./validation.actions";
import {
  CreateReviewParams,
  UpdateReviewParams,
  ReviewLikesParams,
} from "@/types";
import { handleError } from "../utils";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongoose";
import { populateUser } from "./user.actions";
import User, { IUser } from "../database/models/user.model";
import Review, { IReview } from "../database/models/review.model";
import Comment from "../database/models/comment.model";
import Report from "../database/models/report.model";

type GetAllResult = {
  success: boolean;
  data: IReview[] | null;
  error: string | null;
};

type GetReviewResult = {
  success: boolean;
  data: IReview | null;
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
  const { review, rating, path } = params;

  try {
    await connectToDb();

    const { user: currentUser } = await getCurrentUser();

    if (!currentUser) throw new Error("Kindly Sign In First.");

    const createdReview = await Review.create({
      review,
      rating,
      createdBy: currentUser._id,
    });

    if (!createdReview) throw new Error("Failed to create user review.");

    const user = await populateUser(
      User.findByIdAndUpdate(
        currentUser._id,
        { $addToSet: { reviews: createdReview._id } },
        { new: true }
      )
    );

    if (!user) throw new Error("User not found.");

    const data = JSON.parse(JSON.stringify(user));

    revalidatePath(path);
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function updateReviewLikes(
  params: ReviewLikesParams
): Promise<LikesResult> {
  const { reviewId, updaterId, path } = params;

  try {
    await connectToDb();

    const { isTheSameUser, error } = await validateIsTheSameUser(updaterId);

    if (error || !isTheSameUser)
      throw new Error("Not Authorized to access this resource.");

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

    if (!updatedReview) throw new Error("Failed to update the review likes.");

    const index = updatedReview.likes.findIndex(
      (id: ObjectId) => id.toString() === updaterId
    );

    revalidatePath(path);
    return { success: true, data: index >= 0 ? true : false, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function updateReviewDislikes(
  params: ReviewLikesParams
): Promise<LikesResult> {
  const { reviewId, updaterId, path } = params;

  try {
    await connectToDb();

    const { isTheSameUser, error } = await validateIsTheSameUser(updaterId);

    if (error || !isTheSameUser)
      throw new Error("Not Authorized to access this resource.");

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

    if (!updatedReview)
      throw new Error("Failed to update the review dislikes.");

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

    const foundReview = await Review.findById(_id);

    if (!foundReview) throw new Error("Review not found.");

    const createdBy = foundReview.createdBy.toString();

    const { user, isTheSameUser, error } = await validateIsTheSameUser(
      createdBy
    );

    if (!isTheSameUser || error)
      throw new Error("Not Authorized to access this resource.");

    const isReviewBelongToUser = user?.reviews.find(
      (review) => review._id.toString() === _id
    );

    if (!isReviewBelongToUser)
      throw new Error("Not Authorized to access this resource.");

    if (review) foundReview.review = review;
    if (rating) foundReview.rating = rating;
    await foundReview.save();

    const updatedUser = await populateUser(
      User.findById(foundReview.createdBy)
    );

    revalidatePath(path);

    const data = JSON.parse(JSON.stringify(updatedUser));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function deleteReview(
  reviewId: string,
  path: string
): Promise<DeleteResult> {
  try {
    await connectToDb();

    const deletedReview = await Review.findByIdAndDelete(reviewId);

    if (!deletedReview) throw new Error("Review not found or already deleted.");

    await Promise.all(
      deletedReview.comments.map(async (id: ObjectId) => {
        await Comment.findByIdAndDelete(id);
      })
    );

    await Report.deleteMany({ targetId: reviewId, target: "Review" });

    revalidatePath(path);
    return { success: true, data: null, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function getReviewById(
  reviewId: string
): Promise<GetReviewResult> {
  try {
    await connectToDb();

    const review = await Review.findById(reviewId).populate({
      path: "createdBy",
      model: "User",
      select: "_id firstName lastName photo blocked",
    });
    if (!review) throw new Error("Review not found.");

    const data = JSON.parse(JSON.stringify(review));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}
