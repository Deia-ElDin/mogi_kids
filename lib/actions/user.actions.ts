"use server";

import { connectToDb } from "../database";
import { CreateUserParams } from "@/types";
import { handleError } from "../utils";
import { revalidatePath } from "next/cache";
import User from "../database/models/user.model";

export async function createUser(user: CreateUserParams) {
  try {
    await connectToDb();

    const isUserExists = await User.findOne({ email: user.email });
    if (isUserExists) return null;

    const adminMails = ["deia.tech2021@gmail.com", "mohagtareg@gmail.com"];
    const role = adminMails.includes(user.email) ? "Admin" : "User";

    const newUser = await User.create({ ...user, role });

    revalidatePath("/");
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}

export async function getUserByUserId(userId: string) {
  try {
    await connectToDb();

    const user = await User.findById(userId);
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

export async function getUserByClerkId(clerkId: string) {
  try {
    await connectToDb();

    const user = await User.findOne({ clerkId: clerkId });
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}
