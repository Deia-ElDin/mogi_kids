"use server";

import { connectToDb } from "../database";
import { revalidatePath } from "next/cache";
import {
  validateAdmin,
  validatePageAndLimit,
  getCurrentUser,
} from "./validation.actions";
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";
import {
  CreateReportParams,
  GetAllReportsParams,
  DeleteSelectedReportParams,
  DeleteSelectedReportsParams,
} from "@/types";
import { handleError } from "../utils";
import {
  CustomApiError,
  UnauthorizedError,
  UnprocessableEntity,
  NotFoundError,
} from "../errors";
import Report, { IReport } from "../database/models/report.model";

type CountResult = {
  success: boolean;
  data: number | null;
  error: string | null;
};

type GetAllResult = {
  success: boolean;
  data: IReport[] | [] | null;
  totalPages?: number;
  unseen?: number | null;
  error: string | null;
};

type DefaultResult = {
  success: boolean;
  data: IReport | null;
  error: string | null;
};

type DeleteResult = {
  success: boolean;
  data: IReport[] | [] | null;
  totalPages?: number;
  error: string | null;
};

export async function createReport(
  params: CreateReportParams
): Promise<DefaultResult> {
  try {
    await connectToDb();

    const { user: currentUser } = await getCurrentUser();

    if (!currentUser) throw new Error("Kindly Sign In First.");

    const newReport = await Report.create({
      ...params,
      createdBy: currentUser._id,
    });

    if (!newReport) throw new Error("Failed to create the report.");

    return { success: true, data: null, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function countUnseenReports(): Promise<CountResult> {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new UnauthorizedError("Not Authorized to access this resource.");

    const count = await Report.countDocuments({ seen: false });

    revalidatePath("/");
    return { success: true, data: count, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function getAllReports({
  fetch,
  limit = 10,
  page = 1,
}: GetAllReportsParams): Promise<GetAllResult> {
  try {
    validatePageAndLimit(page, limit);

    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new UnauthorizedError("Not Authorized to access this resource.");

    let condition = {};

    if (fetch?.day) {
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

    const reports = await Report.find(condition)
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(limit)
      .populate({
        path: "createdBy",
        model: "User",
        select: "_id firstName lastName blocked photo",
        options: { allowNull: true },
      });

    if (!reports) throw new Error("Failed to fetch the reports.");

    if (reports.length === 0) return { success: true, data: [], error: null };

    const totalPages = Math.ceil(
      (await Report.countDocuments(condition)) / limit
    );

    const data = JSON.parse(JSON.stringify(reports));

    const unseen = await Report.countDocuments({
      ...condition,
      seen: false,
    });

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

export async function markReportAsSeen(
  reportId: string
): Promise<DefaultResult> {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new UnauthorizedError("Not Authorized to access this resource.");

    const seenReport = await Report.findByIdAndUpdate(
      reportId,
      { seen: true },
      { new: true }
    ).populate({
      path: "createdBy",
      model: "User",
      select: "_id firstName lastName blocked photo",
      options: { allowNull: true },
    });

    if (!seenReport)
      throw new Error("Failed to change the seen status of this quotation.");

    const data = JSON.parse(JSON.stringify(seenReport));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function deleteReport({
  reportId,
  page = 1,
  limit = 10,
}: DeleteSelectedReportParams): Promise<DeleteResult> {
  try {
    validatePageAndLimit(page, limit);

    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new UnauthorizedError("Not Authorized to access this resource.");

    const deletedReport = await Report.findByIdAndDelete(reportId);

    if (!deletedReport)
      throw new Error(
        "Failed to find the report or the report already deleted."
      );

    const skipAmount = (Number(page) - 1) * limit;
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(limit)
      .populate({
        path: "createdBy",
        model: "User",
        select: "_id firstName lastName photo",
      });

    if (!reports) throw new Error("Failed to fetch the quotations.");

    if (reports.length === 0) return { success: true, data: [], error: null };

    const totalPages = Math.ceil((await Report.countDocuments()) / limit);

    const data = JSON.parse(JSON.stringify(reports));

    return { success: true, data, totalPages, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function deleteSelectedReports({
  selectedReports,
  page = 1,
  limit = 10,
}: DeleteSelectedReportsParams): Promise<DeleteResult> {
  try {
    validatePageAndLimit(page, limit);

    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new UnauthorizedError("Not Authorized to access this resource.");

    const deletedReports = await Report.deleteMany({
      _id: { $in: selectedReports },
    });

    if (!deletedReports)
      throw new Error(
        "Failed to find the reports or the reports already deleted."
      );

    const skipAmount = (Number(page) - 1) * limit;
    const reports = await Report.find()
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(limit)
      .populate({
        path: "createdBy",
        model: "User",
        select: "_id firstName lastName photo",
      });

    if (!reports) throw new Error("Failed to fetch the quotations.");

    if (reports.length === 0) return { success: true, data: [], error: null };

    const totalPages = Math.ceil((await Report.countDocuments()) / limit);

    const data = JSON.parse(JSON.stringify(reports));

    return { success: true, data, totalPages, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}
