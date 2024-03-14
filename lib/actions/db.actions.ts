"use server";

import { connectToDb } from "../database";
import { DbParams } from "@/types";
import { formatBytes, handleError } from "../utils";
import Db, { IDb } from "../database/models/db.model";
import { getLogo } from "./logo.actions";
import { getGallery } from "./gallery.actions";
import { getAllServices } from "./service.actions";
import { getAllRecords } from "./record.actions";
import { getAllContacts } from "./contact.actions";
import { getAllAboutUs } from "./aboutUs.actions";
import { getAllApplications } from "./career.actions";

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

    const dbs = await Db.findOne({});

    if (!dbs) throw new Error("Failed to get the db size.");

    const logoResult = await getLogo();
    const galleryResult = await getGallery();
    const servicesResult = await getAllServices();
    const recordsResult = await getAllRecords();
    const contactsResult = await getAllContacts();
    const aboutUsResult = await getAllAboutUs();
    const applicationsResult = await getAllApplications({ fetch: {} });

    const logo = logoResult.success ? logoResult.data || null : null;
    const gallery = galleryResult.success ? galleryResult.data || [] : [];
    const services = servicesResult.success ? servicesResult.data || [] : [];
    const records = recordsResult.success ? recordsResult.data || [] : [];
    const contacts = contactsResult.success ? contactsResult.data || [] : [];
    const aboutUs = aboutUsResult.success ? aboutUsResult.data || [] : [];
    const applications = applicationsResult.success
      ? applicationsResult.data || []
      : [];

    const totalSize = formatBytes(
      logo,
      gallery,
      services,
      records,
      contacts,
      aboutUs,
      applications
    );

    dbs.uploadthing = totalSize;

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

    const dbRecord = (await Db.findOne({})) || (await Db.create({}));

    if (!dbRecord) throw new Error("Failed to create or update the db size.");

    const todayDate = new Date().toDateString();
    const todayDb = dbRecord.today.toDateString();

    if (todayDate !== todayDb) {
      dbRecord.today = new Date();
      dbRecord.resend = "0";
    }

    if (params.resend) {
      dbRecord.resend = String(parseInt(dbRecord.resend) + 1);
    }

    await dbRecord.save();

    const data = JSON.parse(JSON.stringify(dbRecord));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
};
