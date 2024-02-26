"use server";

import { connectToDb } from "../database";
import { CreateCommentParams, UpdateCommentParams } from "@/types";
import { handleError } from "../utils";
import { revalidatePath } from "next/cache";
import Comment from "../database/models/comment.model";
import Review from "../database/models/review.model";

export async function createComment(params: CreateCommentParams) {
  const { comment, reviewId, createdBy } = params;

  try {
    await connectToDb();

    const newComment = await Comment.create({
      comment,
      createdBy,
    });

    if (!newComment) throw new Error("Couldn't create the comment.");

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { $addToSet: { comments: newComment._id } },
      { new: true }
    );

    if (!updatedReview) throw new Error("Couldn't update the review.");

    revalidatePath("/");

    return {
      newComment: JSON.parse(JSON.stringify(newComment)),
      updatedReview: JSON.parse(JSON.stringify(updatedReview)),
    };
  } catch (error) {
    handleError(error);
  }
}

export async function updateComment(params: UpdateCommentParams) {
  const { _id, comment, reviewId, createdBy } = params;

  if (!_id || !comment || !reviewId || !createdBy) return;

  try {
    await connectToDb();

    const updatedComment = await Comment.findByIdAndUpdate(
      _id,
      {
        comment,
        createdBy,
      },
      { new: true }
    );

    if (!updatedComment) throw new Error("Couldn't update the comment.");

    revalidatePath("/");

    return JSON.parse(JSON.stringify(updatedComment));
  } catch (error) {
    handleError(error);
  }
}

export async function deleteComment(commentId: string) {
  try {
    await connectToDb();

    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) throw new Error("Couldn't delete the comment.");

    revalidatePath("/");

    return JSON.parse(JSON.stringify(deletedComment));
  } catch (error) {
    handleError(error);
  }
}
