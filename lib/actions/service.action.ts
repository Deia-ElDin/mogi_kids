"use server";

import { revalidatePath } from "next/cache";
import { connectToDb } from "../database";
import { handleError } from "../utils";
import { CreateServicePageParams, UpdateServicePageParams } from "@/types";
import ServicePage from "../database/models/services.model";

export async function createServicePage(props: CreateServicePageParams) {
  const { title, content, path } = props;

  try {
    await connectToDb();

    const servicePage = await ServicePage.create({ title, content });

    revalidatePath(path);
    return JSON.parse(JSON.stringify(servicePage));
  } catch (error) {
    handleError(error);
  }
}

export async function updateServicePage(props: UpdateServicePageParams) {
  const { _id, title, content, path } = props;

  try {
    await connectToDb();

    const updatedServicePage = await ServicePage.findByIdAndUpdate(_id, {
      title,
      content,
    });
    revalidatePath(path);
    return JSON.parse(JSON.stringify(updatedServicePage));
  } catch (error) {
    handleError(error);
  }
}

export async function getServicePage() {
  try {
    await connectToDb();

    const servicePage = await ServicePage.find();
    if (!servicePage?.length) return null;
    return JSON.parse(JSON.stringify(servicePage[0]));
  } catch (error) {
    handleError(error);
  }
}
