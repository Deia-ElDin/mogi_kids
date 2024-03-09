"use server";

import { currentUser } from "@clerk/nextjs";
import { handleError } from "../utils";
import User from "../database/models/user.model";

type Result = {
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

    return { isAdmin, error: null };
  } catch (error) {
    return { isAdmin: false, error: handleError(error) };
  }
}
