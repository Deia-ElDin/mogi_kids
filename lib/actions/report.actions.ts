"use server";

import { connectToDb } from "../database";
import { CreateReportParams } from "@/types";
import { getImgName, handleError } from "../utils";
import { revalidatePath } from "next/cache";
import Report from "../database/models/report.model";

export async function getAllReports() {
  try {
    await connectToDb();

    const reports = await Report.find();

    return JSON.parse(JSON.stringify(reports));
  } catch (error) {
    handleError(error);
  }
}

export async function createReport(params: CreateReportParams) {
  try {
    await connectToDb();

    const report = await Report.create(params);

    if (!report) throw new Error("Failed to create the report.");

    return JSON.parse(JSON.stringify(report));
  } catch (error) {
    handleError(error);
  }
}

export async function deleteReport(reportId: string) {
  try {
    const deleteReport = await Report.findByIdAndDelete(reportId);

    if (!deleteReport)
      throw new Error(
        "Failed to delete the report or the report already deleted."
      );

    return "Successfully deleted the report.";
  } catch (error) {
    handleError(error);
  }
}

export async function deleteAllReports() {
  try {
    await connectToDb();

    await Report.deleteMany();

    return "Successfully deleted all reports.";
  } catch (error) {
    handleError(error);
  }
}
