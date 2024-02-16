"use server";

import { revalidatePath } from "next/cache";
import { connectToDb } from "../database";
import { CreateUserParams } from "@/types";
import { handleError } from "../utils";
import User from "../database/models/user.model";

export async function createUser(user: CreateUserParams) {
  try {
    await connectToDb();

    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}

export async function getUser(userId: string) {
  try {
    await connectToDb();

    const user = await User.findById(userId);
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}
