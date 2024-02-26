"use server";

import { connectToDb } from "../database";
import { CreateAboutUsParams, UpdateAboutUsParams } from "@/types";
import { getImgName, handleError } from "../utils";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";
import AboutUs from "../database/models/about-us.model";

const utapi = new UTApi();

export async function getAllAboutUs() {
  try {
    await connectToDb();

    const aboutUsArr = await AboutUs.find();

    return JSON.parse(JSON.stringify(aboutUsArr));
  } catch (error) {
    handleError(error);
  }
}

export async function createAboutUs(params: CreateAboutUsParams) {
  const { title, content, imgUrl, imgSize, path } = params;

  try {
    await connectToDb();

    const newAboutUsArticle = await AboutUs.create({
      title,
      content,
      imgUrl,
      imgSize,
    });
    if (!newAboutUsArticle)
      throw new Error(
        "Couldn't create the about us article & kindly check the uploadthing database"
      );

    revalidatePath(path);

    return JSON.parse(JSON.stringify(newAboutUsArticle));
  } catch (error) {
    handleError(error);
  }
}

export async function updateAboutUs(params: UpdateAboutUsParams) {
  const { _id, title, content, imgUrl, imgSize, newImg, path } = params;

  if (!_id || !title || !content || !imgUrl || !path) return;

  let updatedAboutUsArticle;

  try {
    await connectToDb();

    const originalAboutUs = await AboutUs.findById(_id);

    if (!originalAboutUs)
      throw new Error("Could not find the original about us article.");

    if (newImg) {
      const imgName = getImgName(originalAboutUs);
      if (!imgName) throw new Error("Failed to read the image name.");
      await utapi.deleteFiles(imgName);

      updatedAboutUsArticle = await AboutUs.findByIdAndUpdate(_id, {
        title,
        content,
        imgUrl,
        imgSize,
      });
    } else {
      updatedAboutUsArticle = await AboutUs.findByIdAndUpdate(_id, {
        title,
        content,
      });
    }

    revalidatePath(path);
    return JSON.parse(JSON.stringify(updatedAboutUsArticle));
  } catch (error) {
    handleError(error);
  }
}

export async function deleteAboutUs(aboutUsArticleId: string, path: string) {
  if (!aboutUsArticleId) return null;

  try {
    await connectToDb();

    const deletedAboutUs = await AboutUs.findByIdAndDelete(aboutUsArticleId);
    if (!deletedAboutUs)
      throw new Error("AboutUs not found or already deleted.");

    const imgName = getImgName(deletedAboutUs);
    if (!imgName) throw new Error("Failed to read the image name.");
    await utapi.deleteFiles(imgName);

    revalidatePath(path);

    return "AboutUs deleted successfully";
  } catch (error) {
    handleError(error);
  }
}
