"use server";

import { connectToDb } from "../database";
import { validateAdmin } from "./validation.actions";
import { CreateRecordParams, UpdateRecordParams } from "@/types";
import { getImgName, handleServerError } from "../utils";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";
import {
  UnauthorizedError,
  UnprocessableEntity,
  NotFoundError,
} from "../errors";
import Record, { IRecord } from "../database/models/record.model";

const utapi = new UTApi();

type GetAllResult = {
  success: boolean;
  data: IRecord[] | null;
  error: string | null;
  statusCode: number;
};

type DefaultResult = {
  success: boolean;
  data: IRecord | null;
  error: string | null;
  statusCode: number;
};

type DeleteResult = {
  success: boolean;
  data: null;
  error: string | null;
  statusCode: number;
};

export async function getAllRecords(): Promise<GetAllResult> {
  try {
    await connectToDb();

    const records = await Record.find();

    const data = JSON.parse(JSON.stringify(records));

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

export async function createRecord(
  params: CreateRecordParams
): Promise<DefaultResult> {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new UnauthorizedError("Not Authorized to access this resource.");

    const newRecord = await Record.create(params);

    if (!newRecord) throw new UnprocessableEntity("Failed to create a record.");

    const data = JSON.parse(JSON.stringify(newRecord));

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

export async function updateRecord(
  params: UpdateRecordParams
): Promise<DefaultResult> {
  const { _id, imgUrl, imgSize, value, label, newImg } = params;

  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new UnauthorizedError("Not Authorized to access this resource.");

    const originalRecord = await Record.findById(_id);

    if (!originalRecord) throw new NotFoundError("Could not find the original record.");

    let updatedRecord = null;

    if (newImg) {
      const imgName = getImgName(originalRecord);
      if (!imgName) throw new UnprocessableEntity("Failed to read the image name.");
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

    if (!updatedRecord)
      throw new NotFoundError("Failed to update the record.");

    const data = JSON.parse(JSON.stringify(updatedRecord));

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

export async function deleteRecord(
  recordId: string,
  revalidate: boolean
): Promise<DeleteResult> {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new UnauthorizedError("Not Authorized to access this resource.");

    const deletedRecord = await Record.findByIdAndDelete(recordId);

    if (!deletedRecord) throw new NotFoundError("Record not found or already deleted.");

    const imgName = getImgName(deletedRecord);
    if (!imgName) throw new UnprocessableEntity("Failed to read the image name.");
    await utapi.deleteFiles(imgName);

    if (revalidate) revalidatePath("/");

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

export async function deleteAllRecords(): Promise<DeleteResult> {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new UnauthorizedError("Not Authorized to access this resource.");

    const allRecords = await Record.find();

    allRecords.map(async (record) => await deleteRecord(record._id, false));

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
