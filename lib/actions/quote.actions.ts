"use server";

import { connectToDb } from "../database";
import { CreateQuoteParams } from "@/types";
import { handleError } from "../utils";
import { revalidatePath } from "next/cache";
import Quote from "../database/models/quote.model";

export async function createQuote(params: CreateQuoteParams) {
  try {
    await connectToDb();

    const newQuote = await Quote.create(params);

    if (!newQuote) throw new Error("Failed to create the quote.");

    revalidatePath("/");

    return JSON.parse(JSON.stringify(newQuote));
  } catch (error) {
    handleError(error);
  }
}
