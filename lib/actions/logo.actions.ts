"use server";

import { connectToDb } from "../database";
import { validateAdmin } from "./validation.actions";
import { CreateLogoParams, UpdateLogoParams } from "@/types";
import { getImgName, handleServerError } from "../utils";
import { UTApi } from "uploadthing/server";
import {
  UnauthorizedError,
  UnprocessableEntity,
  NotFoundError,
} from "../errors";
import { revalidatePath } from "next/cache";
import Logo, { ILogo } from "../database/models/logo.model";

const utapi = new UTApi();

type DefaultResult = {
  success: boolean;
  data: ILogo | null;
  error: string | null;
  statusCode: number;
};

export async function getLogo(): Promise<DefaultResult> {
  try {
    await connectToDb();

    const logo = await Logo.findOne({});

    const data = logo ? JSON.parse(JSON.stringify(logo)) : null;

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

export async function createLogo(
  params: CreateLogoParams
): Promise<DefaultResult> {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new UnauthorizedError("Not Authorized to access this resource.");

    const logo = await Logo.create(params);

    if (!logo) throw new UnprocessableEntity("Failed to create the logo.");

    const data = JSON.parse(JSON.stringify(logo));

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

export async function updateLogo(
  params: UpdateLogoParams
): Promise<DefaultResult> {
  const { _id, imgUrl, imgSize } = params;

  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new UnauthorizedError("Not Authorized to access this resource.");

    const logo = await Logo.findById(_id);

    if (!logo) throw new NotFoundError("Could not find the original logo.");

    const imgName = getImgName(logo);
    if (!imgName)
      throw new UnprocessableEntity("Failed to read the image name.");
    await utapi.deleteFiles(imgName);

    logo.imgUrl = imgUrl;
    logo.imgSize = imgSize;
    await logo.save();

    const data = JSON.parse(JSON.stringify(logo));

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
