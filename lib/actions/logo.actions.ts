"use server";

import { connectToDb } from "../database";
import { CreateLogoParams, UpdateLogoParams } from "@/types";
import { getImgName, handleError } from "../utils";
import { UTApi } from "uploadthing/server";
import Logo, { ILogo } from "../database/models/logo.model";

const utapi = new UTApi();

type LogoFnResult = {
  success: boolean;
  data: ILogo | null;
  error: string | null;
};

export async function getLogo(): Promise<LogoFnResult> {
  try {
    await connectToDb();

    const logo = await Logo.findOne({});

    const data = logo ? JSON.parse(JSON.stringify(logo)) : null;

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function createLogo(
  params: CreateLogoParams
): Promise<LogoFnResult> {
  try {
    await connectToDb();

    const logo = await Logo.create(params);

    if (!logo) throw new Error("Failed to create the logo.");

    const data = JSON.parse(JSON.stringify(logo));
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function updateLogo(
  params: UpdateLogoParams
): Promise<LogoFnResult> {
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

    const logo = await Logo.findById(_id);

    if (!logo) throw new Error("Could not find the original logo.");

    const imgName = getImgName(logo);
    if (!imgName) throw new Error("Failed to read the image name.");
    await utapi.deleteFiles(imgName);

    logo.imgUrl = imgUrl;
    logo.imgSize = imgSize;
    await logo.save();

    const data = JSON.parse(JSON.stringify(logo));
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}
