"use server";

import { connectToDb } from "../database";
import { CreateReportParams } from "@/types";
import { handleError } from "../utils";
import Report, { IReport } from "../database/models/report.model";

type GetAllResult = {
  success: boolean;
  data: IReport[] | [] | null;
  error: string | null;
};

type DefaultResult = {
  success: boolean;
  data: IReport | null;
  error: string | null;
};

type DeleteResult = {
  success: boolean;
  data: null;
  error: string | null;
};

export async function getAllReports(): Promise<GetAllResult> {
  try {
    await connectToDb();

    const reports = await Report.find();

    const data = JSON.parse(JSON.stringify(reports));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function createReport(
  params: CreateReportParams
): Promise<DefaultResult> {
  try {
    await connectToDb();

    const report = await Report.create(params);

    if (!report) throw new Error("Failed to create the report.");

    const data = JSON.parse(JSON.stringify(report));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function deleteReport(reportId: string): Promise<DeleteResult> {
  try {
    const deleteReport = await Report.findByIdAndDelete(reportId);

    if (!deleteReport)
      throw new Error(
        "Failed to delete the report or the report already deleted."
      );

    return { success: true, data: null, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function deleteAllReports(): Promise<DeleteResult> {
  try {
    await connectToDb();

    const deletedReports = await Report.deleteMany();

    if (!deletedReports)
      throw new Error(
        "Failed to delete all the reports or the report already deleted."
      );

    return { success: true, data: null, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}
