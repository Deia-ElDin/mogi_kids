"use server";

import { connectToDb } from "../database";
import { CreatePageParams, UpdatePageParams } from "@/types";
import { handleError } from "../utils";
import { revalidatePath } from "next/cache";
import Page, { IPage } from "../database/models/page.model";

type PageFnResult = {
  success: boolean;
  data: IPage[] | IPage | null;
  error: string | null;
};

export async function getAllPages(): Promise<PageFnResult> {
  try {
    await connectToDb();

    const pages = await Page.find();

    const data = JSON.parse(JSON.stringify(pages));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function getPageByPageName(
  pageName: string
): Promise<PageFnResult> {
  try {
    await connectToDb();

    const page = await Page.findOne({ pageName });

    if (!page) throw new Error("Failed to find the page you looking for.");

    const data = JSON.parse(JSON.stringify(page));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function createPage(
  params: CreatePageParams
): Promise<PageFnResult> {
  const { pageName, pageTitle, pageContent, path } = params;

  try {
    await connectToDb();

    const newPage = await Page.create({ pageName, pageTitle, pageContent });

    if (!newPage) throw new Error("Failed to create the page.");

    revalidatePath(path);

    const data = JSON.parse(JSON.stringify(newPage));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function updatePage(
  params: UpdatePageParams
): Promise<PageFnResult> {
  const { _id, pageName, pageTitle, pageContent, path } = params;

  try {
    await connectToDb();

    const updatedPage = await Page.findByIdAndUpdate(_id, {
      pageName,
      pageTitle,
      pageContent,
    });

    if (!updatedPage) throw new Error("Failed to update the page.");

    revalidatePath(path);

    const data = JSON.parse(JSON.stringify(updatedPage));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function deletePage(
  pageId: string,
  path: string
): Promise<PageFnResult> {
  try {
    await connectToDb();

    const deletedPage = await Page.findByIdAndDelete(pageId);

    if (!deletedPage) throw new Error("Could not find the page.");

    revalidatePath(path);

    const data = JSON.parse(JSON.stringify(deletedPage));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}
