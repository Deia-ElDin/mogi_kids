"use server";

import { connectToDb } from "../database";
import { CreateReviewParams } from "@/types";
import { handleError } from "../utils";
import { revalidatePath } from "next/cache";
import User from "../database/models/user.model";
import Review from "../database/models/review.model";

export async function getAllReviews() {}
export async function createReview(review: CreateReviewParams) {}
export async function deleteReview(reviewId: string) {}
