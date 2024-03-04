"use server";

import { connectToDb } from "../database";
import { CreateAboutUsParams, UpdateAboutUsParams } from "@/types";
import { getImgName, handleError } from "../utils";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";
import AboutUs, { IAboutUs } from "../database/models/about-us.model";

const utapi = new UTApi();

type GetALLResult = {
  success: boolean;
  data: IAboutUs[] | [] | null;
  error: string | null;
};

type DefaultResult = {
  success: boolean;
  data: IAboutUs | null;
  error: string | null;
};

type DeleteResult = {
  success: boolean;
  data: null;
  error: string | null;
};

export async function getAllAboutUs(): Promise<GetALLResult> {
  try {
    await connectToDb();

    const allAboutUs = await AboutUs.find();

    const data = JSON.parse(JSON.stringify(allAboutUs));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function createAboutUs(
  params: CreateAboutUsParams
): Promise<DefaultResult> {
  const { title, content, imgUrl, imgSize, path } = params;

  try {
    await connectToDb();

    const newAboutUs = await AboutUs.create({
      title,
      content,
      imgUrl,
      imgSize,
    });
    if (!newAboutUs)
      throw new Error(
        "Couldn't create the about us article & kindly check the uploadthing database"
      );

    const data = JSON.parse(JSON.stringify(newAboutUs));

    revalidatePath(path);
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function updateAboutUs(
  params: UpdateAboutUsParams
): Promise<DefaultResult> {
  const { _id, title, content, imgUrl, imgSize, newImg, path } = params;

  let updatedAboutUs;

  try {
    await connectToDb();

    const originalAboutUs = await AboutUs.findById(_id);

    if (!originalAboutUs)
      throw new Error("Could not find the original about us article.");

    if (newImg) {
      const imgName = getImgName(originalAboutUs);
      if (!imgName) throw new Error("Failed to read the image name.");
      await utapi.deleteFiles(imgName);

      updatedAboutUs = await AboutUs.findByIdAndUpdate(_id, {
        title,
        content,
        imgUrl,
        imgSize,
      });
    } else {
      updatedAboutUs = await AboutUs.findByIdAndUpdate(_id, {
        title,
        content,
      });
    }

    const data = JSON.parse(JSON.stringify(updatedAboutUs));

    revalidatePath(path);
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function deleteAboutUs(
  aboutUsArticleId: string,
  path: string
): Promise<DeleteResult> {
  try {
    await connectToDb();

    const deletedAboutUs = await AboutUs.findByIdAndDelete(aboutUsArticleId);
    if (!deletedAboutUs)
      throw new Error("AboutUs not found or already deleted.");

    const imgName = getImgName(deletedAboutUs);
    if (!imgName) throw new Error("Failed to read the image name.");
    await utapi.deleteFiles(imgName);

    revalidatePath(path);
    return { success: true, data: null, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}
