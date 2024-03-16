"use server";

import { connectToDb } from "../database";
import {
  validateAdmin,
  validatePageAndLimit,
  getCurrentUser,
} from "./validation.actions";
import { startOfDay, endOfDay, startOfMonth, endOfMonth } from "date-fns";
import {
  CreateApplicationParams,
  GetAllApplicationsParams,
  DeleteSelectedApplicationParams,
  DeleteSelectedApplicationsParams,
} from "@/types";
import { getImgName, handleServerError } from "../utils";
import { revalidatePath } from "next/cache";
import {
  UnauthorizedError,
  UnprocessableEntity,
  NotFoundError,
  ForbiddenError,
  BadRequestError,
} from "../errors";
import { UTApi } from "uploadthing/server";

import Career, { ICareer } from "../database/models/career.model";

const utapi = new UTApi();

type CountResult = {
  success: boolean;
  data: number | null;
  error: string | null;
  statusCode: number;
};

type GetAllResult = {
  success: boolean;
  data: ICareer[] | [] | null;
  totalPages?: number;
  unseen?: number | null;
  error: string | null;
  statusCode: number;
};

type DefaultResult = {
  success: boolean;
  data: ICareer | null;
  error: string | null;
  statusCode: number;
};

type DeleteResult = {
  success: boolean;
  data: ICareer[] | [] | null;
  totalPages?: number;
  error: string | null;
  statusCode: number;
};

export async function countUnseenApplications(): Promise<CountResult> {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new ForbiddenError("Not Authorized to access this resource.");

    const count = await Career.countDocuments({ seen: false });

    revalidatePath("/");
    return { success: true, data: count, error: null, statusCode: 200 };
  } catch (error) {
    const { message, statusCode } = handleServerError(error as Error);
    return {
      success: false,
      data: null,
      error: message,
      statusCode: statusCode,
    };
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
      throw new ForbiddenError("Not Authorized to access this resource.");

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

    if (!applications)
      throw new NotFoundError("Failed to fetch the quotations.");

    if (applications.length === 0)
      return { success: true, data: [], error: null, statusCode: 200 };

    const totalPages = Math.ceil(
      (await Career.countDocuments(condition)) / limit
    );

    const data = JSON.parse(JSON.stringify(applications));

    const unseen = await Career.countDocuments({
      ...condition,
      seen: false,
    });

    return {
      success: true,
      data,
      totalPages,
      unseen,
      error: null,
      statusCode: 200,
    };
  } catch (error) {
    const { message, statusCode } = handleServerError(error as Error);
    return {
      success: false,
      data: null,
      unseen: null,
      error: message,
      statusCode: statusCode,
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
      throw new ForbiddenError("Not Authorized to access this resource.");

    const seenApplication = await Career.findByIdAndUpdate(
      applicationId,
      { seen: true },
      { new: true }
    );

    if (!seenApplication)
      throw new NotFoundError(
        "Failed to change the seen status of this quotation."
      );

    const data = JSON.parse(JSON.stringify(seenApplication));

    return { success: true, data, error: null, statusCode: 200 };
  } catch (error) {
    const { message, statusCode } = handleServerError(error as Error);
    return {
      success: false,
      data: null,
      error: message,
      statusCode: statusCode,
    };
  }
}

export async function createApplication(
  params: CreateApplicationParams
): Promise<DefaultResult> {
  try {
    if (!params)
      throw new BadRequestError("Invalid request: Missing parameters.");

    await connectToDb();

    const { user: currentUser } = await getCurrentUser();

    if (!currentUser) throw new UnauthorizedError("Kindly Sign In First.");

    const newApplication = await Career.create({
      ...params,
      createdBy: currentUser._id,
    });

    if (!newApplication)
      throw new UnprocessableEntity("Failed to create the application.");

    const data = JSON.parse(JSON.stringify(newApplication));

    return { success: true, data, error: null, statusCode: 201 };
  } catch (error) {
    const { message, statusCode } = handleServerError(error as Error);
    return {
      success: false,
      data: null,
      error: message,
      statusCode: statusCode,
    };
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
      throw new ForbiddenError("Not Authorized to access this resource.");

    const deletedApplication = await Career.findByIdAndDelete(applicationId);

    if (!deletedApplication)
      throw new NotFoundError(
        "Failed to find the application or the application already deleted."
      );

    const imgName = getImgName(deletedApplication);
    if (!imgName)
      throw new UnprocessableEntity("Failed to read the image name.");
    await utapi.deleteFiles(imgName);

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

    if (!applications)
      throw new UnprocessableEntity("Failed to fetch the quotations.");

    if (applications.length === 0)
      return { success: true, data: [], error: null, statusCode: 200 };

    const totalPages = Math.ceil((await Career.countDocuments()) / limit);

    const data = JSON.parse(JSON.stringify(applications));

    return { success: true, data, totalPages, error: null, statusCode: 200 };
  } catch (error) {
    const { message, statusCode } = handleServerError(error as Error);
    return {
      success: false,
      data: null,
      error: message,
      statusCode: statusCode,
    };
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
      throw new ForbiddenError("Not Authorized to access this resource.");

    const deletedApplications = await Career.find({
      _id: { $in: selectedApplications },
    });

    if (!deletedApplications)
      throw new NotFoundError(
        "Failed to find the applications or the applications already deleted."
      );

    deletedApplications.map(async (application: ICareer) => {
      await deleteApplication({
        applicationId: application._id,
      });
    });

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

    if (!applications)
      throw new UnprocessableEntity("Failed to fetch the quotations.");

    if (applications.length === 0)
      return { success: true, data: [], error: null, statusCode: 200 };

    const totalPages = Math.ceil((await Career.countDocuments()) / limit);

    const data = JSON.parse(JSON.stringify(applications));

    return { success: true, data, totalPages, error: null, statusCode: 200 };
  } catch (error) {
    const { message, statusCode } = handleServerError(error as Error);
    return {
      success: false,
      data: null,
      error: message,
      statusCode: statusCode,
    };
  }
}
