"use server";

import { connectToDb } from "../database";
import { getCurrentUser, validateIsTheSameUser } from "./validation.actions";
import {
  CreateCommentParams,
  UpdateCommentParams,
  CommentLikesParams,
  DeleteCommentParams,
} from "@/types";
import { handleServerError } from "../utils";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongoose";
import {
  UnprocessableEntity,
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from "../errors";
import Comment, { IComment } from "../database/models/comment.model";
import Review from "../database/models/review.model";
import Report from "../database/models/report.model";

type DefaultResult = {
  success: boolean;
  data: null;
  error: string | null;
  statusCode: number;
};

type GetCommentResult = {
  success: boolean;
  data: IComment | null;
  error: string | null;
  statusCode: number;
};

type LikesResult = {
  success: boolean;
  data: boolean | null;
  error: string | null;
  statusCode: number;
};

export async function createComment(
  params: CreateCommentParams
): Promise<DefaultResult> {
  try {
    if (!params)
      throw new BadRequestError("Invalid request: Missing parameters.");

    const { comment, reviewId, path } = params;

    await connectToDb();

    const { user: currentUser } = await getCurrentUser();

    if (!currentUser) throw new ForbiddenError("Kindly Sign In First.");

    const newComment = await Comment.create({
      comment,
      review: reviewId,
      createdBy: currentUser._id,
    });

    if (!newComment)
      throw new UnprocessableEntity("Couldn't create the comment.");

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      { $addToSet: { comments: newComment._id } },
      { new: true }
    );

    if (!updatedReview) throw new NotFoundError("Couldn't find the review.");

    revalidatePath(path);
    return { success: true, data: null, error: null, statusCode: 204 };
  } catch (error) {
    const { message, statusCode } = handleServerError(error as Error);
    return {
      success: false,
      data: null,
      error: message,
      statusCode: statusCode,
    };
  }
}

export async function updateCommentLikes(
  params: CommentLikesParams
): Promise<LikesResult> {
  const { commentId, updaterId, path } = params;

  try {
    await connectToDb();

    const { isTheSameUser, error } = await validateIsTheSameUser(updaterId);

    if (error || !isTheSameUser)
      throw new ForbiddenError("Not Authorized to access this resource.");

    const comment = await Comment.findById(commentId);

    if (!comment) throw new NotFoundError("Comment not found");

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

    if (!updatedComment)
      throw new UnprocessableEntity("Failed to update comment likes.");

    const index = updatedComment.likes.findIndex(
      (id: ObjectId) => id.toString() === updaterId
    );

    revalidatePath(path);

    return {
      success: true,
      data: index >= 0 ? true : false,
      error: null,
      statusCode: 201,
    };
  } catch (error) {
    const { message, statusCode } = handleServerError(error as Error);
    return {
      success: false,
      data: null,
      error: message,
      statusCode: statusCode,
    };
  }
}

export async function updateCommentDislikes(
  params: CommentLikesParams
): Promise<LikesResult> {
  const { commentId, updaterId, path } = params;

  try {
    await connectToDb();

    const { isTheSameUser, error } = await validateIsTheSameUser(updaterId);

    if (error || !isTheSameUser)
      throw new ForbiddenError("Not Authorized to access this resource.");

    const comment = await Comment.findById(commentId);

    if (!comment) throw new NotFoundError("Comment not found");

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

    if (!updatedComment)
      throw new UnprocessableEntity("Failed to update comment dislikes.");

    const index = updatedComment.dislikes.findIndex(
      (id: ObjectId) => id.toString() === updaterId
    );

    revalidatePath(path);

    return {
      success: true,
      data: index >= 0 ? true : false,
      error: null,
      statusCode: 201,
    };
  } catch (error) {
    const { message, statusCode } = handleServerError(error as Error);
    return {
      success: false,
      data: null,
      error: message,
      statusCode: statusCode,
    };
  }
}

export async function updateComment(
  params: UpdateCommentParams
): Promise<DefaultResult> {
  const { _id, comment, path } = params;

  try {
    await connectToDb();

    const updatedComment = await Comment.findByIdAndUpdate(
      _id,
      { comment },
      { new: true }
    );

    if (!updatedComment)
      throw new NotFoundError("Couldn't update the comment.");

    revalidatePath(path);

    return { success: true, data: null, error: null, statusCode: 204 };
  } catch (error) {
    const { message, statusCode } = handleServerError(error as Error);
    return {
      success: false,
      data: null,
      error: message,
      statusCode: statusCode,
    };
  }
}

export async function deleteComment(
  params: DeleteCommentParams
): Promise<DefaultResult> {
  const { commentId, path } = params;

  try {
    await connectToDb();

    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment)
      throw new NotFoundError("Couldn't delete the comment.");

    const parentReview = await Review.findByIdAndUpdate(
      deletedComment.review,
      { $pull: { comments: commentId } },
      { new: true }
    );

    if (!parentReview)
      throw new NotFoundError("Couldn't update the parent review.");

    await Report.deleteMany({ targetId: commentId, target: "Comment" });

    revalidatePath(path ?? "/");

    return { success: true, data: null, error: null, statusCode: 204 };
  } catch (error) {
    const { message, statusCode } = handleServerError(error as Error);
    return {
      success: false,
      data: null,
      error: message,
      statusCode: statusCode,
    };
  }
}

export async function getCommentById(
  commentId: string
): Promise<GetCommentResult> {
  try {
    await connectToDb();

    const comment = await Comment.findById(commentId).populate({
      path: "createdBy",
      model: "User",
      select: "_id firstName lastName photo email blocked",
    });

    if (!comment) throw new NotFoundError("Comment not found.");

    const data = JSON.parse(JSON.stringify(comment));

    return { success: true, data, error: null, statusCode: 200 };
  } catch (error) {
    const { message, statusCode } = handleServerError(error as Error);
    return {
      success: false,
      data: null,
      error: message,
      statusCode: statusCode,
    };
  }
}
