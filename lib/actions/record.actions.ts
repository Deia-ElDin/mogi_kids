"use server";

import { connectToDb } from "../database";
import { CreateRecordParams, UpdateRecordParams } from "@/types";
import { handleError, getImgName } from "../utils";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";
import Record, { IRecord } from "../database/models/record.model";

const utapi = new UTApi();

type GetAllResult = {
  success: boolean;
  data: IRecord[] | null;
  error: string | null;
};

type DefaultResult = {
  success: boolean;
  data: IRecord | null;
  error: string | null;
};

type DeleteResult = {
  success: boolean;
  data: null;
  error: string | null;
};

export async function getAllRecords(): Promise<GetAllResult> {
  try {
    await connectToDb();

    const records = await Record.find();

    const data = JSON.parse(JSON.stringify(records));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function createRecord(
  params: CreateRecordParams
): Promise<DefaultResult> {
  try {
    await connectToDb();

    const newRecord = await Record.create(params);

    if (!newRecord) throw new Error("Failed to create a record.");

    revalidatePath("/");

    const data = JSON.parse(JSON.stringify(newRecord));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function updateRecord(
  params: UpdateRecordParams
): Promise<DefaultResult> {
  const { _id, imgUrl, imgSize, value, label, newImg } = params;

  try {
    await connectToDb();

    const originalRecord = await Record.findById(_id);

    if (!originalRecord) throw new Error("Could not find the original record.");

    let updatedRecord = null;

    if (newImg) {
      const imgName = getImgName(originalRecord);
      if (!imgName) throw new Error("Failed to read the image name.");
      await utapi.deleteFiles(imgName);

      updatedRecord = await Record.findByIdAndUpdate(_id, {
        imgUrl,
        imgSize,
        value,
        label,
      });
    } else {
      updatedRecord = await Record.findByIdAndUpdate(_id, {
        value,
        label,
      });
    }

    revalidatePath("/");

    const data = JSON.parse(JSON.stringify(updatedRecord));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function deleteRecord(
  recordId: string,
  revalidate: boolean
): Promise<DeleteResult> {
  try {
    await connectToDb();

    const deletedRecord = await Record.findByIdAndDelete(recordId);

    if (!deletedRecord) throw new Error("Record not found or already deleted.");

    const imgName = getImgName(deletedRecord);
    if (!imgName) throw new Error("Failed to read the image name.");
    await utapi.deleteFiles(imgName);

    if (revalidate) revalidatePath("/");

    return { success: true, data: null, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function deleteAllRecords(): Promise<DeleteResult> {
  try {
    await connectToDb();

    const allRecords = await Record.find();

    allRecords.map(async (record) => await deleteRecord(record._id, false));

    revalidatePath("/");

    return { success: true, data: null, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}
