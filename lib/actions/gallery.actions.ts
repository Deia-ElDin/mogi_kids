"use server";

import { connectToDb } from "../database";
import { CreateGalleryParams, UpdateGalleryParams } from "@/types";
import { getImgName, handleError } from "../utils";
import { UTApi } from "uploadthing/server";
import { revalidatePath } from "next/cache";
import Gallery, { IGallery } from "../database/models/gallery.model";

const utapi = new UTApi();

type GalleryFnResult = {
  success: boolean;
  data: IGallery[] | [] | IGallery | null;
  error: string | null;
};

export async function getGallery(): Promise<GalleryFnResult> {
  try {
    await connectToDb();

    const gallery = await Gallery.find();

    const data = JSON.parse(JSON.stringify(gallery));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function createGalleryImg(
  params: CreateGalleryParams
): Promise<GalleryFnResult> {
  try {
    await connectToDb();

    const gallery = await Gallery.create(params);

    if (!gallery) throw new Error("Failed to create the gallery.");

    const data = JSON.parse(JSON.stringify(gallery));

    revalidatePath("/");
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function updateGalleryImg(
  params: UpdateGalleryParams
): Promise<GalleryFnResult> {
  const { _id, imgUrl, imgSize } = params;

  if (!_id || !imgUrl || !imgSize)
    return {
      success: false,
      data: null,
      error:
        "Something is missing either the model _id or the image url or the image size.",
    };

  try {
    await connectToDb();

    const gallery = await Gallery.findById(_id);

    if (!gallery) throw new Error("Could not find the original gallery.");

    const imgName = getImgName(gallery);
    if (!imgName) throw new Error("Failed to read the image name.");
    await utapi.deleteFiles(imgName);

    gallery.imgUrl = imgUrl;
    gallery.imgSize = imgSize;
    await gallery.save();

    const data = JSON.parse(JSON.stringify(gallery));

    revalidatePath("/");

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function deleteGalleryImg(
  imgId: string
): Promise<GalleryFnResult> {
  try {
    await connectToDb();

    const deletedImg = await Gallery.findByIdAndDelete(imgId);

    if (!deletedImg) throw new Error("Failed to delete the image.");

    const imgName = getImgName(deletedImg);
    if (!imgName) throw new Error("Failed to read the image name.");
    await utapi.deleteFiles(imgName);

    const data = JSON.parse(JSON.stringify(deletedImg));

    revalidatePath("/");

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}
