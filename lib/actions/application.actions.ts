"use server";

import { connectToDb } from "../database";
import { updateDbSize } from "./db.actions";
import { CreateApplicationParams, UnseenApplicationsParams } from "@/types";
import { formatDate } from "@/lib/utils";
import { handleError } from "../utils";
import { revalidatePath } from "next/cache";
import Application, {
  IApplication,
} from "../database/models/application.model";

type CountResult = {
  success: boolean;
  data: number | null;
  error: string | null;
};

type GetAllResult = {
  success: boolean;
  data: IApplication[] | [] | null;
  totalPages?: number;
  error: string | null;
};

type DefaultResult = {
  success: boolean;
  data: IApplication | null;
  error: string | null;
};

type DeleteResult = {
  success: boolean;
  data: null;
  error: string | null;
};

export async function countUnseenApplications(): Promise<CountResult> {
  try {
    await connectToDb();

    const count = await Application.countDocuments({ seen: false });

    revalidatePath("/");
    return { success: true, data: count, error: null };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: handleError("Failed to count unseen applications"),
    };
  }
}

export async function getAllApplications({
  limit = 10,
  page = 1,
}: UnseenApplicationsParams): Promise<GetAllResult> {
  try {
    await connectToDb();

    const skipAmount = (Number(page) - 1) * limit;
    const conditions = { blocked: false };

    const applications = await Application.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit)
      .populate({
        path: "createdBy",
        model: "User",
        select: "_id firstName lastName photo",
      });

    if (!applications) throw new Error("Failed to fetch the quotations.");

    if (applications.length === 0)
      return { success: true, data: [], error: null };

    const totalPages = Math.ceil(
      (await Application.countDocuments(conditions)) / limit
    );

    const data = JSON.parse(JSON.stringify(applications));

    return { success: true, data, totalPages, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function getApplicationByName(
  fullName: string
): Promise<GetAllResult> {
  try {
    await connectToDb();

    const regex = new RegExp(`^${fullName}`, "i");
    const cstApplications = await Application.find({ fullName: regex })
      .sort({
        createdAt: "desc",
      })
      .populate({
        path: "createdBy",
        model: "User",
        select: "_id firstName lastName photo",
      });

    if (!cstApplications)
      throw new Error(`Failed to get applications for customer: ${fullName}.`);

    const data =
      cstApplications.length === 0
        ? null
        : JSON.parse(JSON.stringify(cstApplications));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function getDayApplications(
  day: Date = new Date()
): Promise<GetAllResult> {
  try {
    await connectToDb();

    day.setHours(0, 0, 0, 0);
    const endOfTheDay = new Date(day);
    endOfTheDay.setDate(day.getDate() + 1);

    const todayApplications = await Application.find({
      createdAt: { $gte: day, $lt: endOfTheDay },
    })
      .sort({ createdAt: "desc" })
      .populate({
        path: "createdBy",
        model: "User",
        select: "_id firstName lastName photo",
      });

    if (!todayApplications)
      throw new Error(
        `Failed to get the ${formatDate(String(day))} applications.`
      );

    const data =
      todayApplications.length === 0
        ? null
        : JSON.parse(JSON.stringify(todayApplications));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function getMonthApplications(date: Date): Promise<GetAllResult> {
  try {
    await connectToDb();

    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);

    const monthApplications = await Application.find({
      createdAt: { $gte: startDate, $lte: endDate },
    })
      .sort({ createdAt: "desc" })
      .populate({
        path: "createdBy",
        model: "User",
        select: "_id firstName lastName photo",
      });

    if (!monthApplications)
      throw new Error(`Failed to get applications for ${month}-${year}.`);

    const data =
      monthApplications.length === 0
        ? null
        : JSON.parse(JSON.stringify(monthApplications));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function createApplication(
  params: CreateApplicationParams
): Promise<DefaultResult> {
  try {
    await connectToDb();

    console.log("params", params);

    const newApplication = await Application.create(params);

    console.log("newApplication", newApplication);

    if (!newApplication) throw new Error("Failed to create the application.");

    const { success: dbSuccess, error: dbError } = await updateDbSize({
      resend: "1",
    });

    if (!dbSuccess && dbError) throw new Error(dbError);

    const data = JSON.parse(JSON.stringify(newApplication));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function markApplicationAsSeen(
  applicationId: string
): Promise<DefaultResult> {
  try {
    const seenApplication = await Application.findByIdAndUpdate(
      applicationId,
      { seen: true },
      { new: true }
    );

    if (!seenApplication)
      throw new Error("Failed to change the seen status of this quotation.");

    const data = JSON.parse(JSON.stringify(seenApplication));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function deleteApplication(
  applicationId: string
): Promise<DeleteResult> {
  try {
    await connectToDb();

    const deletedApplication = await Application.findByIdAndDelete(
      applicationId
    );

    if (!deletedApplication)
      throw new Error(
        "Failed to find the application or the application already deleted."
      );

    return { success: true, data: null, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function deleteSelectedApplications(
  selectedApplications: string[]
): Promise<DeleteResult> {
  try {
    await connectToDb();

    const deletedApplications = await Application.deleteMany({
      _id: { $in: selectedApplications },
    });

    if (!deletedApplications)
      throw new Error(
        "Failed to find the applications or the applications already deleted."
      );

    return { success: true, data: null, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}
