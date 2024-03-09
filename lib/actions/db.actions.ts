"use server";

import { connectToDb } from "../database";
import { validateAdmin } from "./validation.actions";
import { DbParams } from "@/types";
import { handleError } from "../utils";
import Db, { IDb } from "../database/models/db.model";

type GetALLResult = {
  success: boolean;
  data: IDb | null;
  error: string | null;
};

type DefaultResult = {
  success: boolean;
  data: IDb | null;
  error: string | null;
};

export const getDbsSize = async (): Promise<GetALLResult> => {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new Error("Not Authorized to access this resource.");

    const dbs = await Db.findOne({});

    if (!dbs) throw new Error("Failed to get the db size.");

    const todayDate = new Date().toDateString();
    const todayDb = dbs.today.toDateString();

    if (todayDate !== todayDb && dbs.resend !== "0") dbs.resend = "0";

    await dbs.save();

    const data = JSON.parse(JSON.stringify(dbs));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
};

export const updateDbSize = async (
  params: DbParams
): Promise<DefaultResult> => {
  try {
    await connectToDb();

    let dbRecord = await Db.findOne({});

    if (!dbRecord) dbRecord = await Db.create(params);

    if (!dbRecord) {
      throw new Error("Failed to create or update the db size.");
    }

    const todayDate = new Date().toDateString();
    const todayDb = dbRecord.today.toDateString();

    if (todayDate !== todayDb) dbRecord.resend = "0";

    if (params.resend) {
      dbRecord.resend = String(
        parseInt(dbRecord.resend) + parseInt(params.resend)
      );
    }

    await dbRecord.save();

    const data = JSON.parse(JSON.stringify(dbRecord));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
};
