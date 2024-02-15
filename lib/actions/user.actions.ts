"use server";
import { revalidatePath } from "next/cache";
import { connectToDb } from "../database";
import User from "../database/models/user.model";
import { CreateUserParams } from "@/types";
import { handleError } from "../utils";

export async function createUser(user: CreateUserParams) {
  try {
    await connectToDb();

    const newUser = User.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}
