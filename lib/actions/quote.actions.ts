"use server";

import { connectToDb } from "../database";
import { updateDbSize } from "./db.actions";
import { CreateQuoteParams } from "@/types";
import { formatDate } from "@/lib/utils";
import { getAllUnseenQuotesParams } from "@/types";
import { handleError } from "../utils";
import { revalidatePath } from "next/cache";
import Quote, { IQuote } from "../database/models/quote.model";

type CountResult = {
  success: boolean;
  data: number | null;
  error: string | null;
};

type GetAllResult = {
  success: boolean;
  data: IQuote[] | [] | null;
  totalPages?: number;
  error: string | null;
};

type DefaultResult = {
  success: boolean;
  data: IQuote | null;
  error: string | null;
};

type DeleteResult = {
  success: boolean;
  data: null;
  error: string | null;
};

export async function countUnseenQuotes(): Promise<CountResult> {
  try {
    await connectToDb();

    const count = await Quote.countDocuments({ seen: false });

    revalidatePath("/");
    return { success: true, data: count, error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: handleError("Failed to count unseen quotes"),
    };
  }
}

export async function getAllQuotes({
  limit = 10,
  page = 1,
}: getAllUnseenQuotesParams): Promise<GetAllResult> {
  try {
    await connectToDb();

    const skipAmount = (Number(page) - 1) * limit;
    const conditions = { blocked: false };

    const quotes = await Quote.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit)
      .populate({
        path: "createdBy",
        model: "User",
        select: "_id firstName lastName photo",
      });

    if (!quotes) throw new Error("Failed to fetch the quotations.");

    if (quotes.length === 0) return { success: true, data: [], error: null };

    const totalPages = Math.ceil(
      (await Quote.countDocuments(conditions)) / limit
    );

    const data = JSON.parse(JSON.stringify(quotes));

    return { success: true, data, totalPages, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export const getCstNameQuotes = async (
  cstName: string
): Promise<GetAllResult> => {
  try {
    await connectToDb();

    const regex = new RegExp(`^${cstName}`, "i");
    const cstQuotes = await Quote.find({ cstName: regex })
      .sort({
        createdAt: "desc",
      })
      .populate({
        path: "createdBy",
        model: "User",
        select: "_id firstName lastName photo",
      });

    if (!cstQuotes)
      throw new Error(`Failed to get quotes for customer: ${cstName}.`);

    const data =
      cstQuotes.length === 0 ? null : JSON.parse(JSON.stringify(cstQuotes));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
};

export const getDayQuotes = async (
  day: Date = new Date()
): Promise<GetAllResult> => {
  try {
    await connectToDb();

    day.setHours(0, 0, 0, 0);
    const endOfTheDay = new Date(day);
    endOfTheDay.setDate(day.getDate() + 1);

    const todayQuotes = await Quote.find({
      createdAt: { $gte: day, $lt: endOfTheDay },
    })
      .sort({ createdAt: "desc" })
      .populate({
        path: "createdBy",
        model: "User",
        select: "_id firstName lastName photo",
      });

    if (!todayQuotes)
      throw new Error(`Failed to get the ${formatDate(String(day))} quotes.`);

    const data =
      todayQuotes.length === 0 ? null : JSON.parse(JSON.stringify(todayQuotes));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
};

export const getMonthQuotes = async (date: Date): Promise<GetAllResult> => {
  try {
    await connectToDb();

    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const monthQuotes = await Quote.find({
      createdAt: { $gte: startDate, $lte: endDate },
    })
      .sort({ createdAt: "desc" })
      .populate({
        path: "createdBy",
        model: "User",
        select: "_id firstName lastName photo",
      });

    if (!monthQuotes)
      throw new Error(`Failed to get quotes for ${month}-${year}.`);

    const data =
      monthQuotes.length === 0 ? null : JSON.parse(JSON.stringify(monthQuotes));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
};

export async function createQuote(
  params: CreateQuoteParams
): Promise<DefaultResult> {
  try {
    await connectToDb();

    const newQuote = await Quote.create(params);

    if (!newQuote) throw new Error("Failed to create the quote.");

    const { success: dbSuccess, error: dbError } = await updateDbSize({
      resend: "1",
    });

    if (!dbSuccess && dbError) throw new Error(dbError);

    const data = JSON.parse(JSON.stringify(newQuote));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function markQuoteAsSeen(quoteId: string): Promise<DefaultResult> {
  try {
    const seenQuote = await Quote.findByIdAndUpdate(
      quoteId,
      { seen: true },
      { new: true }
    );

    if (!seenQuote)
      throw new Error("Failed to change the seen status of this quotation.");

    const data = JSON.parse(JSON.stringify(seenQuote));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function deleteQuote(quoteId: string): Promise<DeleteResult> {
  try {
    await connectToDb();

    const deletedQuote = await Quote.findByIdAndDelete(quoteId);

    if (!deletedQuote)
      throw new Error("Failed to find the quote or the quote already deleted.");

    return { success: true, data: null, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export const deleteSelectedQuotes = async (
  selectedQuotes: string[]
): Promise<DeleteResult> => {
  try {
    await connectToDb();

    const deletedQuotes = await Quote.deleteMany({
      _id: { $in: selectedQuotes },
    });

    if (!deletedQuotes)
      throw new Error(
        "Failed to find the quotes or the quotes already deleted."
      );

    return { success: true, data: null, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
};
