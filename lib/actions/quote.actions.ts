"use server";

import { connectToDb } from "../database";
import { CreateQuoteParams } from "@/types";
import { handleError } from "../utils";
import { revalidatePath } from "next/cache";
import Quote, { IQuote } from "../database/models/quote.model";

type GetAllResult = {
  success: boolean;
  data: IQuote[] | [] | null;
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

export async function getAllQuotes(): Promise<GetAllResult> {
  try {
    await connectToDb();

    const quotes = await Quote.find().sort({ createdAt: -1 });

    if (!quotes) throw new Error("Failed to get the quotes.");

    const data = JSON.parse(JSON.stringify(quotes));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function createQuote(
  params: CreateQuoteParams
): Promise<DefaultResult> {
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
