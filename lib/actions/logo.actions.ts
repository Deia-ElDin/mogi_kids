"use server";

import { connectToDb } from "../database";
import { CreateLogoParams, UpdateLogoParams } from "@/types";
import { getImgName, handleError } from "../utils";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";
import Logo from "../database/models/logo.model";

const utapi = new UTApi();

// try {
//   const logo = await getLogo();
//   // Do something with the logo
// } catch (error) {
//   // Handle the error
//   console.error("Error fetching logo:", error.message);
//   // Optionally, show a message to the user or perform other actions

export async function getLogo() {
  try {
    await connectToDb();

    const logo = await Logo.findOne({});

    if (!logo) return null;

    return JSON.parse(JSON.stringify(logo));
  } catch (error) {
    handleError(error);
  }
}

export async function createLogo(params: CreateLogoParams) {
  try {
    await connectToDb();

    const newLogo = await Logo.create(params);

    if (!newLogo) throw new Error("Failed to create the logo.");

    revalidatePath("/");

    return JSON.parse(JSON.stringify(newLogo));
  } catch (error) {
    handleError(error);
  }
}

export async function updateLogo(params: UpdateLogoParams) {
  const { _id, imgUrl, imgSize } = params;

  if (!_id || !imgUrl || !imgSize) return;

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

    revalidatePath("/");
    return JSON.parse(JSON.stringify(logo));
  } catch (error) {
    handleError(error);
  }
}
