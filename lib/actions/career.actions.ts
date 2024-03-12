"use server";

import { connectToDb } from "../database";
import {
  validateAdmin,
  validatePageAndLimit,
  validateIsTheSameUser,
} from "./validation.actions";
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";
import {
  CreateApplicationParams,
  GetAllApplicationsParams,
  DeleteSelectedApplicationParams,
  DeleteSelectedApplicationsParams,
} from "@/types";
import { handleError } from "../utils";
import { revalidatePath } from "next/cache";
import Career, { ICareer } from "../database/models/career.model";

type CountResult = {
  success: boolean;
  data: number | null;
  error: string | null;
};

type GetAllResult = {
  success: boolean;
  data: ICareer[] | [] | null;
  totalPages?: number;
  unseen?: number | null;
  error: string | null;
};

type DefaultResult = {
  success: boolean;
  data: ICareer | null;
  error: string | null;
};

type DeleteResult = {
  success: boolean;
  data: ICareer[] | [] | null;
  totalPages?: number;
  error: string | null;
};

export async function createApplication(
  params: CreateApplicationParams
): Promise<DefaultResult> {
  try {
    await connectToDb();

    if (params.createdBy) {
      const { isTheSameUser, error } = await validateIsTheSameUser(
        params.createdBy
      );

      if (error || !isTheSameUser)
        throw new Error("Not Authorized to access this resource.");
    }

    const newApplication = await Career.create(params);

    if (!newApplication) throw new Error("Failed to create the application.");

    const data = JSON.parse(JSON.stringify(newApplication));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function countUnseenApplications(): Promise<CountResult> {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new Error("Not Authorized to access this resource.");

    const count = await Career.countDocuments({ seen: false });

    revalidatePath("/");
    return { success: true, data: count, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function getAllApplications({
  fetch,
  limit = 10,
  page = 1,
}: GetAllApplicationsParams): Promise<GetAllResult> {
  try {
    validatePageAndLimit(page, limit);

    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new Error("Not Authorized to access this resource.");

    let condition = {};

    if (fetch?.applicantName)
      condition = { fullName: new RegExp(`^${fetch?.applicantName}`, "i") };
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

    const applications = await Career.find(condition)
      .sort({ createdAt: -1 })
      .skip(skipAmount)
      .limit(limit)
      .populate({
        path: "createdBy",
        model: "User",
        select: "_id firstName lastName photo",
        options: { allowNull: true },
      });

    if (!applications) throw new Error("Failed to fetch the quotations.");

    if (applications.length === 0)
      return { success: true, data: [], error: null };

    const totalPages = Math.ceil(
      (await Career.countDocuments(condition)) / limit
    );

    const data = JSON.parse(JSON.stringify(applications));

    const unseen = await Career.countDocuments({
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

export async function markApplicationAsSeen(
  applicationId: string
): Promise<DefaultResult> {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new Error("Not Authorized to access this resource.");

    const seenApplication = await Career.findByIdAndUpdate(
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

export async function deleteApplication({
  applicationId,
  page = 1,
  limit = 10,
}: DeleteSelectedApplicationParams): Promise<DeleteResult> {
  try {
    validatePageAndLimit(page, limit);

    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new Error("Not Authorized to access this resource.");

    const deletedApplication = await Career.findByIdAndDelete(applicationId);

    if (!deletedApplication)
      throw new Error(
        "Failed to find the application or the application already deleted."
      );

    const skipAmount = (Number(page) - 1) * limit;
    const applications = await Career.find()
      .sort({ createdAt: -1 })
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

    const totalPages = Math.ceil((await Career.countDocuments()) / limit);

    const data = JSON.parse(JSON.stringify(applications));

    return { success: true, data, totalPages, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function deleteSelectedApplications({
  selectedApplications,
  page = 1,
  limit = 10,
}: DeleteSelectedApplicationsParams): Promise<DeleteResult> {
  try {
    validatePageAndLimit(page, limit);

    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new Error("Not Authorized to access this resource.");

    const deletedApplications = await Career.deleteMany({
      _id: { $in: selectedApplications },
    });

    if (!deletedApplications)
      throw new Error(
        "Failed to find the applications or the applications already deleted."
      );

    const skipAmount = (Number(page) - 1) * limit;
    const applications = await Career.find()
      .sort({ createdAt: -1 })
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

    const totalPages = Math.ceil((await Career.countDocuments()) / limit);

    const data = JSON.parse(JSON.stringify(applications));

    return { success: true, data, totalPages, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}
