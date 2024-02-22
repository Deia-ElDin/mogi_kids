"use server";

import { connectToDb } from "../database";
import { CreateRecordParams, UpdateRecordParams } from "@/types";
import { handleError, getImgName } from "../utils";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";
import Record from "../database/models/record.model";

const utapi = new UTApi();

export async function getAllRecords() {
  try {
    await connectToDb();

    const records = await Record.find();

    return JSON.parse(JSON.stringify(records));
  } catch (error) {
    handleError(error);
  }
}

export async function createRecord(params: CreateRecordParams) {
  try {
    await connectToDb();

    const newRecord = await Record.create(params);

    if (!newRecord) throw new Error("Failed to create a record.");

    revalidatePath("/");

    return JSON.parse(JSON.stringify(newRecord));
  } catch (error) {
    handleError(error);
  }
}

export async function updateRecord(params: UpdateRecordParams) {
  const { _id, imgUrl, imgSize, value, label, backgroundColor, newImg } =
    params;

  if (!_id || !imgUrl || !label) return;

  let updatedRecord;
  try {
    await connectToDb();

    const originalRecord = await Record.findById(_id);

    if (!originalRecord) throw new Error("Could not find the original record.");

    if (newImg) {
      const imgName = getImgName(originalRecord);
      if (!imgName) throw new Error("Failed to read the image name.");
      await utapi.deleteFiles(imgName);

      updatedRecord = await Record.findByIdAndUpdate(_id, {
        imgUrl,
        imgSize,
        value,
        label,
        backgroundColor,
      });
    } else {
      updatedRecord = await Record.findByIdAndUpdate(_id, {
        value,
        label,
        backgroundColor,
      });
    }

    revalidatePath("/");
    return JSON.parse(JSON.stringify(updatedRecord));
  } catch (error) {
    handleError(error);
  }
}

export async function deleteRecord(recordId: string) {
  try {
    await connectToDb();

    const deletedRecord = await Record.findByIdAndDelete(recordId);

    if (!deletedRecord) throw new Error("Record not found or already deleted.");

    const imgName = getImgName(deletedRecord);
    if (!imgName) throw new Error("Failed to read the image name.");
    await utapi.deleteFiles(imgName);

    revalidatePath("/");

    return "Record deleted successfully";
  } catch (error) {
    handleError(error);
  }
}

export async function deleteAllRecords() {
  try {
    await connectToDb();

    const allRecords = await Record.find();

    allRecords.map(async (record) => await deleteRecord(record._id));

    revalidatePath("/");

    return "All records deleted successfully";
  } catch (error) {
    handleError(error);
  }
}
