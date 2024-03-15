"use server";

import { connectToDb } from "../database";
import { validateAdmin } from "./validation.actions";
import { CreateGalleryParams, UpdateGalleryParams } from "@/types";
import { getImgName, handleServerError } from "../utils";
import { UTApi } from "uploadthing/server";
import { revalidatePath } from "next/cache";
import {
  UnauthorizedError,
  UnprocessableEntity,
  NotFoundError,
} from "../errors";
import Gallery, { IGallery } from "../database/models/gallery.model";

const utapi = new UTApi();

type GetALLResult = {
  success: boolean;
  data: IGallery[] | [] | null;
  error: string | null;
  statusCode: number;
};

type DefaultResult = {
  success: boolean;
  data: IGallery | null;
  error: string | null;
  statusCode: number;
};

type DeleteResult = {
  success: boolean;
  data: null;
  error: string | null;
  statusCode: number;
};

export async function getGallery(): Promise<GetALLResult> {
  try {
    await connectToDb();

    const gallery = await Gallery.find().sort({ createdAt: -1 });

    const data = JSON.parse(JSON.stringify(gallery));

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

export async function createGalleryImg(
  params: CreateGalleryParams
): Promise<DefaultResult> {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new UnauthorizedError("Not Authorized to access this resource.");

    const gallery = await Gallery.create(params);

    if (!gallery) throw new UnprocessableEntity("Failed to create the gallery.");

    const data = JSON.parse(JSON.stringify(gallery));

    revalidatePath("/");
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

export async function updateGalleryImg(
  params: UpdateGalleryParams
): Promise<DefaultResult> {
  const { _id, imgUrl, imgSize } = params;

  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new UnauthorizedError("Not Authorized to access this resource.");

    const gallery = await Gallery.findById(_id);

    if (!gallery) throw new NotFoundError("Could not find the original gallery.");

    const imgName = getImgName(gallery);
    if (!imgName) throw new UnprocessableEntity("Failed to read the image name.");
    await utapi.deleteFiles(imgName);

    gallery.imgUrl = imgUrl;
    gallery.imgSize = imgSize;
    await gallery.save();

    const data = JSON.parse(JSON.stringify(gallery));

    revalidatePath("/");
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

export async function deleteGalleryImg(imgId: string): Promise<DeleteResult> {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new UnauthorizedError("Not Authorized to access this resource.");

    const deletedImg = await Gallery.findByIdAndDelete(imgId);

    if (!deletedImg) throw new UnprocessableEntity("Failed to delete the image.");

    const imgName = getImgName(deletedImg);
    if (!imgName) throw new UnprocessableEntity("Failed to read the image name.");
    await utapi.deleteFiles(imgName);

    revalidatePath("/");
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
