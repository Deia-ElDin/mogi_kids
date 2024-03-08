"use server";

import { connectToDb } from "../database";
import { CreateUserParams } from "@/types";
import { handleError } from "../utils";
import { revalidatePath } from "next/cache";
import User, { IUser } from "../database/models/user.model";
import Career from "../database/models/application.model";
import Quote from "../database/models/quote.model";
import Review from "../database/models/review.model";
import Comment from "../database/models/comment.model";

type GetALLResult = {
  success: boolean;
  data: IUser[] | null;
  error: string | null;
};

type DefaultResult = {
  success: boolean;
  data: IUser | null;
  error: string | null;
};

type BlockResult = {
  success: boolean;
  data: null;
  error: string | null;
};

export const populateUser = (query: any) => {
  return query.populate({
    path: "reviews",
    model: Review,
    populate: [
      {
        path: "createdBy",
        model: "User",
        options: { sort: { createdAt: -1 } },
        select: "_id firstName lastName photo",
      },
      {
        path: "comments",
        model: "Comment",
        populate: {
          path: "createdBy",
          model: "User",
          select: "_id firstName lastName photo",
        },
      },
    ],
  });
};

export async function getAllUsers(): Promise<GetALLResult> {
  try {
    await connectToDb();

    const users = await populateUser(User.find());

    const data = JSON.parse(JSON.stringify(users));

    revalidatePath("/");
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function createUser(
  user: CreateUserParams
): Promise<DefaultResult> {
  try {
    await connectToDb();

    const isUserExists = await User.findOne({ email: user.email });

    if (isUserExists) return { success: false, data: null, error: null };

    const adminMails = ["deia.tech2021@gmail.com", "mohagtareg@gmail.com"];
    const role = adminMails.includes(user.email) ? "Admin" : "User";

    const newUser = await User.create({ ...user, role });

    if (!newUser) throw new Error("Failed to create user.");

    const data = JSON.parse(JSON.stringify(newUser));

    revalidatePath("/");
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function getUserByUserId(userId: string): Promise<DefaultResult> {
  try {
    await connectToDb();

    const foundUser = await populateUser(User.findById(userId));

    if (!foundUser) throw new Error("User not found.");

    const data = JSON.parse(JSON.stringify(foundUser));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function getUserByClerkId(
  clerkId: string
): Promise<DefaultResult> {
  try {
    await connectToDb();

    const foundUser = await populateUser(User.findOne({ clerkId }));

    if (!foundUser) throw new Error("User not found.");

    const data = JSON.parse(JSON.stringify(foundUser));

    revalidatePath("/");
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function blockUser(userId: string): Promise<BlockResult> {
  try {
    await connectToDb();

    const blockedUser = await User.findByIdAndUpdate(
      userId,
      { blocked: true },
      { new: true }
    );

    if (!blockedUser) throw new Error("Failed to block the user.");

    await Career.deleteMany({ createdBy: userId });
    await Quote.deleteMany({ createdBy: userId });
    await Review.deleteMany({ createdBy: userId });

    const comments = await Comment.find({ createdBy: userId });
    for (const comment of comments) {
      await Review.updateOne(
        { _id: comment.review },
        { $pull: { comments: comment._id } }
      );
      await Comment.findByIdAndDelete(comment._id);
    }

    return { success: true, data: null, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}
