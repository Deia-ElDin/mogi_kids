"use server";

import { connectToDb } from "../database";
import { CreateQuoteParams } from "@/types";
import { handleError } from "../utils";
import { revalidatePath } from "next/cache";
import { formatDate } from "@/lib/utils";
import { GetALLQuotesParams } from "@/types";
import Quote, { IQuote } from "../database/models/quote.model";

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

export async function getAllQuotes({
  limit = 3,
  page = 1,
}: GetALLQuotesParams): Promise<GetAllResult> {
  try {
    await connectToDb();

    const skipAmount = (Number(page) - 1) * limit;
    const conditions = { block: false };

    const quotes = await Quote.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit);

    if (!quotes) throw new Error("Failed to get the quotes.");

    const totalPages = Math.ceil(
      (await Quote.countDocuments(conditions)) / limit
    );

    const data = JSON.parse(JSON.stringify(quotes));

    return { success: true, data, totalPages, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export const getDayQuotes = async (day: Date = new Date()) => {
  try {
    await connectToDb();

    day.setHours(0, 0, 0, 0);
    const endOfTheDay = new Date(day);
    endOfTheDay.setDate(day.getDate() + 1);

    const todayQuotes = await Quote.find({
      createdAt: { $gte: day, $lt: endOfTheDay },
    });

    if (!todayQuotes)
      throw new Error(`Failed to get the ${formatDate(String(day))} quotes.`);

    const data = JSON.parse(JSON.stringify(todayQuotes));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
};

export async function createQuote(
  params: CreateQuoteParams
): Promise<DefaultResult> {
  console.log("params", params);

  try {
    await connectToDb();

    const newQuote = await Quote.create(params);

    if (!newQuote) throw new Error("Failed to create the quote.");

    const data = JSON.parse(JSON.stringify(newQuote));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function deleteQuote(
  quoteId: string,
  path: string
): Promise<DeleteResult> {
  try {
    await connectToDb();

    const deletedQuote = await Quote.findByIdAndDelete(quoteId);

    if (!deletedQuote)
      throw new Error("Failed to find the quote or the quote already deleted.");

    revalidatePath(path);
    return { success: true, data: null, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function deleteAllQuotes(): Promise<DeleteResult> {
  try {
    await connectToDb();

    const deletedQuotes = await Quote.deleteMany();

    if (!deletedQuotes)
      throw new Error(
        "Failed to find the quotes or the quotes already deleted."
      );

    return { success: true, data: null, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

// export async function getRelatedEventsByCategory({
//   categoryId,
//   eventId,
//   limit = 3,
//   page = 1,
// }: GetRelatedEventsByCategoryParams) {
//   try {
//     await connectToDb();

//     const skipAmount = (Number(page) - 1) * limit;
//     const conditions = {
//       $and: [{ category: categoryId }, { _id: { $ne: eventId } }],
//     };

//     const eventsQuery = Event.find(conditions)
//       .sort({ createdAt: "desc" })
//       .skip(skipAmount)
//       .limit(limit);

//     const events = await populateEvent(eventsQuery);
//     const eventsCount = await Event.countDocuments(conditions);

//     return {
//       data: JSON.parse(JSON.stringify(events)),
//       totalPages: Math.ceil(eventsCount / limit),
//     };
//   } catch (error) {
//     handleError(error);
//   }
// }
