"use server";

import { connectToDb } from "../database";
import { DbParams } from "@/types";
import { handleError } from "../utils";
import Db, { IDb } from "../database/models/db.model";

type GetALLResult = {
  success: boolean;
  data: IDb[] | [] | null;
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

    // delete require.cache[require.resolve("../database/models/db.model")];
    // // const Quote = require("../database/models/db.model");

    const dbs = await Db.findOne({});

    if (!dbs) throw new Error("Failed to get the db size.");

    const today = new Date().toDateString();
    const updatedAt = dbs.updatedAt.toDateString();

    if (today !== updatedAt && dbs.resend !== "0") dbs.resend = "0";

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

    let dbs = await Db.findOne({});

    if (!dbs) dbs = await Db.create(params);

    if (!dbs) throw new Error("Failed to create or update the db size.");

    console.log("dbs1", dbs);

    const today = new Date().toDateString();
    const updatedAt = dbs.updatedAt.toDateString();
    console.log("today", today);
    // if (today !== updatedAt) dbs.resend = "0";

    // if (params.resend)
    //   dbs.resend = String(parseInt(dbs.resend) + parseInt(params.resend));

    // dbs.save();
    const data = JSON.parse(JSON.stringify(dbs));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
};
