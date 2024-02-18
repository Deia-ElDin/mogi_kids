"use server";

import { connectToDb } from "../database";
import { CreateUserParams } from "@/types";
import { handleError } from "../utils";
import UserModel from "../database/models/user.model";

export async function createUser(user: CreateUserParams) {
  try {
    await connectToDb();

    console.log("we should be here");

    const newUser = await UserModel.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}

export async function getUserByUserId(userId: string) {
  try {
    await connectToDb();

    const user = await UserModel.findById(userId);
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

export async function getUserByClerkId(clerkId: string) {
  try {
    await connectToDb();

    const user = await UserModel.findOne({ clerkId: clerkId });
    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}
