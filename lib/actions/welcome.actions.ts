"use server";

import { revalidatePath } from "next/cache";
import { connectToDb } from "../database";
import { handleError } from "../utils";
import { CreateWelcomePageParams } from "@/types";
import WelcomePage from "../database/models/welcome.model";

export async function createWelcomePage(props: CreateWelcomePageParams) {
  const { title, content, path } = props;

  try {
    await connectToDb();

    const welcomePage = await WelcomePage.create({ title, content });
    revalidatePath(path);
    return JSON.parse(JSON.stringify(welcomePage));
  } catch (error) {
    handleError(error);
  }
}

export async function updateWelcomePage({
  _id,
  title,
  content,
  path,
}: {
  _id: string;
  title: string;
  content: string;
  path: string;
}) {
  try {
    await connectToDb();

    const updatedWelcomePage = await WelcomePage.findByIdAndUpdate(_id, {
      title,
      content,
    });

    revalidatePath(path);
    return JSON.parse(JSON.stringify(updatedWelcomePage));
  } catch (error) {
    handleError(error);
  }
}

export async function getWelcomePage() {
  try {
    await connectToDb();

    const welcomePage = await WelcomePage.find();
    if (!welcomePage?.length) return null;
    return JSON.parse(JSON.stringify(welcomePage[0]));
  } catch (error) {
    handleError(error);
  }
}
