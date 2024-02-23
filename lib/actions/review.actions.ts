"use server";

import { connectToDb } from "../database";
import { CreateReviewParams, UpdateReviewParams } from "@/types";
import { handleError } from "../utils";
import { revalidatePath } from "next/cache";
import User from "../database/models/user.model";
import Review from "../database/models/review.model";


export async function getAllReviews() {
  try {
    await connectToDb();

    const reviews = await Review.find().populate({
      path: "user",
      model: User,
      select: "_id firstName lastName photo",
    });

    const invalidReviews = reviews.filter(
      (review) => !review.user || !review.user._id
    );

    if (invalidReviews.length > 0) {
      throw new Error("Some reviews have invalid user references.");
    }

    revalidatePath("/");

    return JSON.parse(JSON.stringify(reviews));
  } catch (error) {
    handleError(error);
  }
}

export async function createReview(reviewObj: CreateReviewParams) {
  const { user, review, rating } = reviewObj;

  try {
    await connectToDb();

    const createdReview = await Review.create({
      review,
      rating,
      user: user._id,
    });

    if (!createdReview) throw new Error("Failed to create user review.");

    const dbUser = await User.findByIdAndUpdate(
      user._id,
      { $addToSet: { reviews: createdReview._id } },
      { new: true }
    );

    if (!dbUser) throw new Error("User not found.");

    revalidatePath(`/users/${user._id}`);
  } catch (error) {
    handleError(error);
  }
}

export async function updateReview(reviewObj: UpdateReviewParams) {
  const { _id, user, review, rating } = reviewObj;

  try {
    await connectToDb();

    const updatedReview = await Review.findByIdAndUpdate(_id, {
      review,
      rating,
      user: user._id,
    });

    if (!updatedReview) throw new Error("Failed to create user review.");

    revalidatePath(`/users/${user._id}`);
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

export async function deleteAllReviews() {
  try {
    await connectToDb();

    const reviews = await Review.find();

    for (const review of reviews) {
      await Review.findByIdAndDelete(review._id);
      await User.findByIdAndUpdate(review.user._id, {
        $pull: { reviews: review._id },
      });
    }

    revalidatePath("/");

    return "All reviews deleted successfully";
  } catch (error) {
    handleError(error);
  }
}
