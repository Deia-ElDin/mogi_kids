"use server";

import { connectToDb } from "../database";
import { validateAdmin } from "./validation.actions";
import { updateDbSize } from "./db.actions";
import {
  CreateQuoteParams,
  UpdateQuoteParams,
  UnseenQuotesParams,
} from "@/types";
import { formatDate } from "@/lib/utils";
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

export async function createQuote(
  params: CreateQuoteParams
): Promise<DefaultResult> {
  try {
    await connectToDb();

    console.log("params", params);

    const newQuote = await Quote.create(params);

    if (!newQuote) throw new Error("Failed to create the quote.");

    console.log("newQuote", newQuote);

    const { success: dbSuccess, error: dbError } = await updateDbSize({
      resend: "1",
    });

    console.log("dbError", dbError);

    if (!dbSuccess && dbError) throw new Error(dbError);

    const data = JSON.parse(JSON.stringify(newQuote));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function countUnseenQuotes(): Promise<CountResult> {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new Error("Not Authorized to access this resource.");

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
}: UnseenQuotesParams): Promise<GetAllResult> {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new Error("Not Authorized to access this resource.");

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

export async function getCstNameQuotes(cstName: string): Promise<GetAllResult> {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new Error("Not Authorized to access this resource.");

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
}

export async function getDayQuotes(
  day: Date = new Date()
): Promise<GetAllResult> {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new Error("Not Authorized to access this resource.");

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
}

export async function getMonthQuotes(date: Date): Promise<GetAllResult> {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new Error("Not Authorized to access this resource.");

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
}

export async function updateQuote(
  params: UpdateQuoteParams
): Promise<DefaultResult> {
  const { quoteId, emailService } = params;
  try {
    await connectToDb();

    const updatedQuote = await Quote.findByIdAndUpdate(
      quoteId,
      { emailService },
      { new: true }
    );

    if (!updatedQuote)
      throw new Error("Failed to update the email service of this quotation.");

    return { success: true, data: null, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function markQuoteAsSeen(quoteId: string): Promise<DefaultResult> {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new Error("Not Authorized to access this resource.");

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

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new Error("Not Authorized to access this resource.");

    const deletedQuote = await Quote.findByIdAndDelete(quoteId);

    if (!deletedQuote)
      throw new Error("Failed to find the quote or the quote already deleted.");

    return { success: true, data: null, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function deleteSelectedQuotes(
  selectedQuotes: string[]
): Promise<DeleteResult> {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new Error("Not Authorized to access this resource.");

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
}
