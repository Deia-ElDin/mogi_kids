"use server";

import { connectToDb } from "../database";
import { validateAdmin } from "./validation.actions";
import { CreatePageParams, UpdatePageParams } from "@/types";
import { handleServerError } from "../utils";
import { revalidatePath } from "next/cache";
import { UnprocessableEntity, NotFoundError, ForbiddenError } from "../errors";
import Page, { IPage } from "../database/models/page.model";

type GetAllResult = {
  success: boolean;
  data: IPage[] | null;
  error: string | null;
  statusCode: number;
};

type DefaultResult = {
  success: boolean;
  data: IPage | null;
  error: string | null;
  statusCode: number;
};

type DeleteResult = {
  success: boolean;
  data: null;
  error: string | null;
  statusCode: number;
};

export async function getAllPages(): Promise<GetAllResult> {
  try {
    await connectToDb();

    const pages = await Page.find();

    const data = JSON.parse(JSON.stringify(pages));

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

export async function getPageByPageName(
  pageName: string
): Promise<DefaultResult> {
  try {
    await connectToDb();

    const page = await Page.findOne({ pageName });

    if (!page)
      throw new NotFoundError("Failed to find the page you looking for.");

    const data = JSON.parse(JSON.stringify(page));

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

export async function createPage(
  params: CreatePageParams
): Promise<DefaultResult> {
  const { pageName, pageTitle, pageContent, path } = params;

  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new ForbiddenError("Not Authorized to access this resource.");

    const newPage = await Page.create({ pageName, pageTitle, pageContent });

    if (!newPage) throw new UnprocessableEntity("Failed to create the page.");

    const data = JSON.parse(JSON.stringify(newPage));

    revalidatePath(path);

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

export async function updatePage(
  params: UpdatePageParams
): Promise<DefaultResult> {
  const { _id, pageName, pageTitle, pageContent, path } = params;

  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new ForbiddenError("Not Authorized to access this resource.");

    const updatedPage = await Page.findByIdAndUpdate(_id, {
      pageName,
      pageTitle,
      pageContent,
    });

    if (!updatedPage) throw new NotFoundError("Failed to update the page.");

    const data = JSON.parse(JSON.stringify(updatedPage));

    revalidatePath(path);

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

export async function deletePage(
  pageId: string,
  path: string
): Promise<DeleteResult> {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new ForbiddenError("Not Authorized to access this resource.");

    const deletedPage = await Page.findByIdAndDelete(pageId);

    if (!deletedPage) throw new NotFoundError("Could not find the page.");

    revalidatePath(path);

    return { success: true, data: null, error: null, statusCode: 204 };
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

// import { Response } from "express";

// export async function getPageByPageName(
//   pageName: string,
//   res: Response // Pass the response object as a parameter
// ): Promise<void> {
//   try {
//     await connectToDb();

//     const page = await Page.findOne({ pageName });

//     if (!page) {
//       res.status(404).json({ success: false, data: null, error: "Failed to find the page you are looking for." });
//       return;
//     }

//     const data = JSON.parse(JSON.stringify(page));

//     res.status(200).json({ success: true, data, error: null });
//   } catch (error) {
//     res.status(500).json({ success: false, data: null, error: handleError(error) });
//   }
// }
