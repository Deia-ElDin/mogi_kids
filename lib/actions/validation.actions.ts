"use server";

import { currentUser } from "@clerk/nextjs";
import { handleError } from "../utils";
import User, { IUser } from "../database/models/user.model";

type isAdminResult = {
  user: IUser | null;
  isAdmin: boolean;
  error: string | null;
};

type isTheSameUserResult = {
  user: IUser | null;
  isTheSameUser: boolean;
  error: string | null;
};

export async function validateAdmin(): Promise<isAdminResult> {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) throw new Error("Authentication Error.");

    const mongoDbUser = await User.findOne({ clerkId: clerkUser.id });

    if (!mongoDbUser) throw new Error("Authentication Error.");

    const isAdmin =
      mongoDbUser.role === "Manager" || mongoDbUser.role === "Admin";

    return { user: mongoDbUser, isAdmin, error: null };
  } catch (error) {
    return { user: null, isAdmin: false, error: handleError(error) };
  }
}

export async function validateIsTheSameUser(
  userId: string
): Promise<isTheSameUserResult> {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) throw new Error("Authentication Error.");

    const mongoDbUser = await User.findOne({ clerkId: clerkUser.id });

    if (!mongoDbUser) throw new Error("Authentication Error.");

    const isTheSameUser = mongoDbUser._id === userId;

    return { user: mongoDbUser, isTheSameUser, error: null };
  } catch (error) {
    return { user: null, isTheSameUser: false, error: handleError(error) };
  }
}

export async function validatePageAndLimit(page: number, limit: number) {
  if (
    isNaN(page) ||
    isNaN(limit) ||
    !Number.isInteger(page) ||
    !Number.isInteger(limit) ||
    page < 1 ||
    limit < 1
  ) {
    throw new Error("Invalid page or limit parameters.");
  }
}
