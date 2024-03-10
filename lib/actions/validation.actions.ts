"use server";

import { currentUser } from "@clerk/nextjs";
import { handleError } from "../utils";
import User, { IUser } from "../database/models/user.model";

type Result = {
  user: IUser | null;
  isAdmin: boolean;
  error: string | null;
};

export async function validateAdmin(): Promise<Result> {
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
