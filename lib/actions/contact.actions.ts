"use server";

import { connectToDb } from "../database";
import { CreateContactsParams, UpdateContactsParams } from "@/types";
import { getImgName, handleError } from "../utils";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";
import Contact, { IContact } from "../database/models/contact.model";

const utapi = new UTApi();

type GetALLResult = {
  success: boolean;
  data: IContact[] | [] | null;
  error: string | null;
};

type DefaultResult = {
  success: boolean;
  data: IContact | null;
  error: string | null;
};

type DeleteResult = {
  success: boolean;
  data: null;
  error: string | null;
};

export async function getAllContacts(): Promise<GetALLResult> {
  try {
    await connectToDb();

    const contacts = await Contact.find();

    const data = JSON.parse(JSON.stringify(contacts));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function createContact(
  params: CreateContactsParams
): Promise<DefaultResult> {
  try {
    await connectToDb();

    const newContact = await Contact.create(params);

    if (!newContact) throw new Error("Failed to create the contact.");

    const data = JSON.parse(JSON.stringify(newContact));

    revalidatePath("/");
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function updateContact(
  params: UpdateContactsParams
): Promise<DefaultResult> {
  const { _id, imgUrl, imgSize, content, newImg } = params;

  try {
    await connectToDb();

    const originalContact = await Contact.findById(_id);

    if (!originalContact)
      throw new Error("Could not find the original contact.");

    let updatedContact = null;

    if (newImg) {
      const imgName = getImgName(originalContact);
      if (!imgName) throw new Error("Failed to read the image name.");
      await utapi.deleteFiles(imgName);

      updatedContact = await Contact.findByIdAndUpdate(_id, {
        imgUrl,
        imgSize,
        content,
      });
    } else {
      updatedContact = await Contact.findByIdAndUpdate(_id, {
        content,
      });
    }

    const data = JSON.parse(JSON.stringify(updatedContact));

    revalidatePath("/");
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function deleteContact(
  contactId: string,
  revalidate: boolean
): Promise<DeleteResult> {
  try {
    await connectToDb();

    const deletedContact = await Contact.findByIdAndDelete(contactId);

    if (!deletedContact) throw new Error("Failed to delete the contacts.");

    const imgName = getImgName(deletedContact);
    if (!imgName) throw new Error("Failed to read the image name.");
    await utapi.deleteFiles(imgName);

    if (revalidate) revalidatePath("/");
    return { success: true, data: null, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function deleteAllContacts(): Promise<DeleteResult> {
  try {
    const contacts = await Contact.find();

    contacts.map(async (contact) => await deleteContact(contact._id, false));

    revalidatePath("/");
    return { success: true, data: null, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}
