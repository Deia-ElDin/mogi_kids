"use server";

import { revalidatePath } from "next/cache";
import { connectToDb } from "../database";
import { handleError } from "../utils";
import { CreatePageParams, UpdatePageParams } from "@/types";
import Page from "../database/models/page.model";

export async function createPage(params: CreatePageParams) {
  const { pageName, pageTitle, pageContent, path } = params;

  console.log("params = ", params);

  try {
    await connectToDb();

    const newPage = await Page.create({ pageName, pageTitle, pageContent });

    revalidatePath(path);

    return JSON.parse(JSON.stringify(newPage));
  } catch (error) {
    handleError(error);
  }
}

export async function updatePage(params: UpdatePageParams) {
  const { _id, pageName, pageTitle, pageContent, path } = params;

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

export async function getPage(pageName: string) {
  try {
    await connectToDb();

    const page = await Page.findOne({ pageName });

    return JSON.parse(JSON.stringify(page));
  } catch (error) {
    handleError(error);
  }
}
