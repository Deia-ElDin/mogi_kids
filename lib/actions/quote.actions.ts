"use server";

import { NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { connectToDb } from "../database";
import {
  validateAdmin,
  getCurrentUser,
  validatePageAndLimit,
} from "./validation.actions";
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";
import { updateDbSize } from "./db.actions";
import {
  CreateQuoteParams,
  UpdateQuoteParams,
  GetAllQuotesParams,
  DeleteSelectedQuoteParams,
  DeleteSelectedQuotesParams,
} from "@/types";
import { handleError } from "../utils";
import { revalidatePath } from "next/cache";
import {
  CustomApiError,
  UnauthorizedError,
  UnprocessableEntity,
  NotFoundError,
} from "../errors";
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
  unseen?: number | null;
  error: string | null;
};

type DefaultResult = {
  success: boolean;
  data: IQuote | null;
  error: string | null;
};

type DeleteResult = {
  success: boolean;
  data: IQuote[] | [] | null;
  totalPages?: number;
  error: string | null;
};

class CustomError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
  }
}

export async function createQuote(
  params: CreateQuoteParams
): Promise<DefaultResult> {
  try {
    if (!params) {
      throw new CustomError("Invalid request: Missing parameters.", 400);
    }
    await connectToDb();

    const { user } = await getCurrentUser();

    const newQuote = await Quote.create({
      ...params,
      createdBy: user?._id ?? null,
    });

    if (!newQuote) throw new Error("Failed to create the quote.");

    const { success: dbSuccess, error: dbError } = await updateDbSize({
      resend: true,
    });

    if (!dbSuccess && dbError) throw new Error(dbError);

    const data = JSON.parse(JSON.stringify(newQuote));

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

export async function countUnseenQuotes(): Promise<CountResult> {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new UnauthorizedError("Not Authorized to access this resource.");

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
  fetch,
  limit = 10,
  page = 1,
}: GetAllQuotesParams): Promise<GetAllResult> {
  try {
    validatePageAndLimit(page, limit);

    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new UnauthorizedError("Not Authorized to access this resource.");

    let condition = {};

    if (fetch?.cstName)
      condition = { cstName: new RegExp(`^${fetch?.cstName}`, "i") };
    else if (fetch?.email)
      condition = { email: new RegExp(`^${fetch?.email}`, "i") };
    else if (fetch?.day) {
      const day = new Date(fetch?.day);
      const startOfTheDay = startOfDay(day);
      const endOfTheDay = endOfDay(day);
      condition = { createdAt: { $gte: startOfTheDay, $lt: endOfTheDay } };
    } else if (fetch?.month) {
      const month = fetch?.month.getMonth();
      const year = fetch?.month.getFullYear();
      const startDate = startOfMonth(new Date(year, month, 1));
      const endDate = endOfMonth(new Date(year, month, 1));
      condition = { createdAt: { $gte: startDate, $lte: endDate } };
    }

    const skipAmount = (Number(page) - 1) * limit;

    const quotes = await Quote.find(condition)
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(limit)
      .populate({
        path: "createdBy",
        model: "User",
        select: "_id firstName lastName photo",
        options: { allowNull: true },
      });

    if (!quotes) throw new Error("Failed to fetch the quotations.");

    if (quotes.length === 0) return { success: true, data: [], error: null };

    const totalPages = Math.ceil(
      (await Quote.countDocuments(condition)) / limit
    );

    const data = JSON.parse(JSON.stringify(quotes));

    const unseen = await Quote.countDocuments({ ...condition, seen: false });

    return { success: true, data, totalPages, unseen, error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      unseen: null,
      error: handleError(error),
    };
  }
}

export async function markQuoteAsSeen(quoteId: string): Promise<DefaultResult> {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new UnauthorizedError("Not Authorized to access this resource.");

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

export async function deleteQuote({
  quoteId,
  page = 1,
  limit = 10,
}: DeleteSelectedQuoteParams): Promise<DeleteResult> {
  try {
    validatePageAndLimit(page, limit);

    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new UnauthorizedError("Not Authorized to access this resource.");

    const deletedQuote = await Quote.findByIdAndDelete(quoteId);

    if (!deletedQuote)
      throw new Error("Failed to find the quote or the quote already deleted.");

    const skipAmount = (Number(page) - 1) * limit;
    const quotes = await Quote.find()
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(limit)
      .populate({
        path: "createdBy",
        model: "User",
        select: "_id firstName lastName photo",
      });

    if (!quotes) throw new Error("Failed to fetch the quotations.");

    if (quotes.length === 0) return { success: true, data: [], error: null };

    const totalPages = Math.ceil((await Quote.countDocuments()) / limit);

    const data = JSON.parse(JSON.stringify(quotes));

    return { success: true, data, totalPages, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function deleteSelectedQuotes({
  selectedQuotes,
  page = 1,
  limit = 10,
}: DeleteSelectedQuotesParams): Promise<DeleteResult> {
  try {
    validatePageAndLimit(page, limit);

    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new UnauthorizedError("Not Authorized to access this resource.");

    const deletedQuotes = await Quote.deleteMany({
      _id: { $in: selectedQuotes },
    });

    if (!deletedQuotes)
      throw new Error(
        "Failed to find the quotes or the quotes already deleted."
      );

    const skipAmount = (Number(page) - 1) * limit;
    const quotes = await Quote.find()
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(limit)
      .populate({
        path: "createdBy",
        model: "User",
        select: "_id firstName lastName photo",
      });

    if (!quotes) throw new Error("Failed to fetch the quotations.");

    if (quotes.length === 0) return { success: true, data: [], error: null };

    const totalPages = Math.ceil((await Quote.countDocuments()) / limit);

    const data = JSON.parse(JSON.stringify(quotes));

    return { success: true, data, totalPages, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}
