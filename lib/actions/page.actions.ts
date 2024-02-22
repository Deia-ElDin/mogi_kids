"use server";

import { connectToDb } from "../database";
import { CreatePageParams, UpdatePageParams } from "@/types";
import { handleError } from "../utils";
import { revalidatePath } from "next/cache";
import Page from "../database/models/page.model";

export async function getAllPages() {
  try {
    await connectToDb();

    const pages = await Page.find();
    return JSON.parse(JSON.stringify(pages));
  } catch (error) {
    handleError(error);
  }
}

export async function getPageByPageName(pageName: string) {
  try {
    await connectToDb();

    const page = await Page.findOne({ pageName });

    return JSON.parse(JSON.stringify(page));
  } catch (error) {
    handleError(error);
  }
}

export async function createPage(params: CreatePageParams) {
  const { pageName, pageTitle, pageContent, path } = params;

  try {
    await connectToDb();

    const newPage = await Page.create({ pageName, pageTitle, pageContent });

    revalidatePath(path);

    return JSON.parse(JSON.stringify(newPage));
  } catch (error) {
    console.log(error);
    handleError(error);
  }
}

export async function updatePage(params: UpdatePageParams) {
  const { _id, pageName, pageTitle, pageContent, path } = params;

  console.log("params = ", params);

  try {
    await connectToDb();

    const updatedPage = await Page.findByIdAndUpdate(_id, {
      pageName,
      pageTitle,
      pageContent,
    });

    revalidatePath(path);

    return JSON.parse(JSON.stringify(updatedPage));
  } catch (error) {
    handleError(error);
  }
}

export async function deletePage(pageId: string, path: string) {
  try {
    await connectToDb();

    const deletedPage = await Page.findByIdAndDelete(pageId);

    if (!deletedPage) throw new Error("Could not find the page.");

    revalidatePath(path);

    return "Page deleted successfully";
  } catch (error) {
    handleError(error);
  }
}
