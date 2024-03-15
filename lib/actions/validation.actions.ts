"use server";

import { currentUser } from "@clerk/nextjs";
import { handleError } from "../utils";
import User, { IUser } from "../database/models/user.model";

type CurrentUserResult = {
  user: IUser | null;
  error: string | null;
};

type AdminResult = {
  user: IUser | null;
  isManager: boolean;
  isAdmin: boolean;
  error: string | null;
};

type TheSameUserResult = {
  user: IUser | null;
  isTheSameUser: boolean;
  error: string | null;
};

export async function getCurrentUser(): Promise<CurrentUserResult> {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) return { user: null, error: null };

    const mongoDbUser = await User.findOne({ clerkId: clerkUser.id });

    if (!mongoDbUser) throw new Error("Current User / MongoDb Error.");

    return { user: mongoDbUser, error: null };
  } catch (error) {
    return { user: null, error: handleError(error) };
  }
}

export async function validateAdmin(): Promise<AdminResult> {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) throw new Error("Authentication Error.");

    const mongoDbUser = await User.findOne({ clerkId: clerkUser.id });

    if (!mongoDbUser) throw new Error("Authentication Error.");

    const isManager = mongoDbUser.role === "Manager";
    const isAdmin =
      mongoDbUser.role === "Manager" || mongoDbUser.role === "Admin";

    return { user: mongoDbUser, isManager, isAdmin, error: null };
  } catch (error) {
    return {
      user: null,
      isManager: false,
      isAdmin: false,
      error: handleError(error),
    };
  }
}

export async function validateIsTheSameUser(
  userId: string
): Promise<TheSameUserResult> {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) throw new Error("Authentication Error.");

    const mongoDbUser = await User.findOne({ clerkId: clerkUser.id });

    if (!mongoDbUser) throw new Error("Authentication Error.");

    const isTheSameUser = String(mongoDbUser._id) === userId;

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
