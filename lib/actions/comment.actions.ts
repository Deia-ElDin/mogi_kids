"use server";

import { connectToDb } from "../database";
import { CreateCommentParams, UpdateCommentParams } from "@/types";
import { handleError } from "../utils";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongoose";
import Comment from "../database/models/comment.model";
import Review from "../database/models/review.model";

export async function createComment(params: CreateCommentParams) {
  const { comment, reviewId, createdBy } = params;

  try {
    await connectToDb();

    await Comment.updateMany({}, { $set: { block: false } });
    await Review.updateMany({}, { $set: { block: false } });

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
  const { _id, comment } = params;

  if (!_id || !comment) return;

  try {
    await connectToDb();

    const updatedComment = await Comment.findByIdAndUpdate(
      _id,
      { comment },
      { new: true }
    );

    if (!updatedComment) throw new Error("Couldn't update the comment.");

    revalidatePath("/");

    return JSON.parse(JSON.stringify(updatedComment));
  } catch (error) {
    handleError(error);
  }
}

export async function deleteComment(commentId: string, reviewId: string) {
  try {
    await connectToDb();

    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) throw new Error("Couldn't delete the comment.");

    const parentReview = await Review.findByIdAndUpdate(
      reviewId,
      { $pull: { comments: commentId } },
      { new: true }
    );

    revalidatePath("/");

    return JSON.parse(JSON.stringify(parentReview));
  } catch (error) {
    handleError(error);
  }
}

export async function updateCommentLikes(commentId: string, updaterId: string) {
  try {
    await connectToDb();

    const comment = await Comment.findById(commentId);

    if (!comment) throw new Error("Comment not found");

    const likesIndex = comment.likes.findIndex(
      (id: ObjectId) => id.toString() === updaterId
    );

    const dislikesIndex = comment.dislikes.findIndex(
      (id: ObjectId) => id.toString() === updaterId
    );

    if (dislikesIndex !== -1) comment.dislikes.splice(dislikesIndex, 1);

    if (likesIndex !== -1) comment.likes.splice(likesIndex, 1);
    else comment.likes.push(updaterId);

    const updatedComment = await comment.save();

    if (!updatedComment) throw new Error("Failed to update comment likes.");

    revalidatePath("/");

    return JSON.parse(JSON.stringify(updatedComment));
  } catch (error) {
    handleError(error);
  }
}

export async function updateCommentDislikes(
  commentId: string,
  updaterId: string
) {
  try {
    await connectToDb();

    const comment = await Comment.findById(commentId);

    if (!comment) throw new Error("Comment not found");

    const likesIndex = comment.likes.findIndex(
      (id: ObjectId) => id.toString() === updaterId
    );
    const dislikesIndex = comment.dislikes.findIndex(
      (id: ObjectId) => id.toString() === updaterId
    );

    if (likesIndex !== -1) comment.likes.splice(likesIndex, 1);

    if (dislikesIndex !== -1) comment.dislikes.splice(dislikesIndex, 1);
    else comment.dislikes.push(updaterId);

    const updatedComment = await comment.save();

    if (!updatedComment) throw new Error("Failed to update comment dislikes.");

    revalidatePath("/");

    return JSON.parse(JSON.stringify(updatedComment));
  } catch (error) {
    handleError(error);
  }
}
