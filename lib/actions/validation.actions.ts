"use server";

import { currentUser } from "@clerk/nextjs";
import { handleServerError } from "../utils";
import { ForbiddenError } from "../errors";
import User, { IUser } from "../database/models/user.model";

type CurrentUserResult = {
  user: IUser | null;
  error: string | null;
  statusCode: number;
};

type AdminResult = {
  user: IUser | null;
  isManager: boolean;
  isAdmin: boolean;
  error: string | null;
  statusCode: number;
};

type TheSameUserResult = {
  user: IUser | null;
  isTheSameUser: boolean;
  error: string | null;
  statusCode: number;
};

export async function getCurrentUser(): Promise<CurrentUserResult> {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) return { user: null, error: null, statusCode: 200 };

    const mongoDbUser = await User.findOne({ clerkId: clerkUser.id });

    if (!mongoDbUser) throw new ForbiddenError("Forbidden Error MongoDb.");

    return { user: mongoDbUser, error: null, statusCode: 200 };
  } catch (error) {
    const { message, statusCode } = handleServerError(error as Error);
    return {
      user: null,
      error: message,
      statusCode: statusCode,
    };
  }
}

export async function validateAdmin(): Promise<AdminResult> {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) throw new ForbiddenError("Forbidden Error ClerkDb.");

    const mongoDbUser = await User.findOne({ clerkId: clerkUser.id });

    if (!mongoDbUser) throw new ForbiddenError("Forbidden Error MongoDb.");

    const isManager = mongoDbUser.role === "Manager";
    const isAdmin =
      mongoDbUser.role === "Manager" || mongoDbUser.role === "Admin";

    return {
      user: mongoDbUser,
      isManager,
      isAdmin,
      error: null,
      statusCode: 200,
    };
  } catch (error) {
    const { message, statusCode } = handleServerError(error as Error);
    return {
      user: null,
      isManager: false,
      isAdmin: false,
      error: message,
      statusCode: statusCode,
    };
  }
}

export async function validateIsTheSameUser(
  userId: string
): Promise<TheSameUserResult> {
  try {
    const clerkUser = await currentUser();

    if (!clerkUser) throw new ForbiddenError("Forbidden Error ClerkDb.");

    const mongoDbUser = await User.findOne({ clerkId: clerkUser.id });

    if (!mongoDbUser) throw new ForbiddenError("Forbidden Error MongoDb.");

    const isTheSameUser = String(mongoDbUser._id) === userId;

    return { user: mongoDbUser, isTheSameUser, error: null, statusCode: 200 };
  } catch (error) {
    const { message, statusCode } = handleServerError(error as Error);
    return {
      user: null,
      isTheSameUser: false,
      error: message,
      statusCode: statusCode,
    };
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
