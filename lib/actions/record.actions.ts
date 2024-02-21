"use server";

import { connectToDb } from "../database";
import { CreateRecordParams, UpdateRecordParams } from "@/types";
import { handleError } from "../utils";
import { revalidatePath } from "next/cache";
import Record from "../database/models/record.model";

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
  let { _id, svgUrl, number, label, backgroundColor } = params;

  try {
    await connectToDb();

    const updatedRecord = await Record.findByIdAndUpdate(_id, {
      svgUrl,
      number,
      label,
      backgroundColor,
    });

    if (!updatedRecord) throw new Error("Failed to update the record.");

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

    revalidatePath("/");

    return null;
  } catch (error) {
    handleError(error);
  }
}
