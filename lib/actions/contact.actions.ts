"use server";

import { connectToDb } from "../database";
import { validateAdmin } from "./validation.actions";
import { CreateContactsParams, UpdateContactsParams } from "@/types";
import { getImgName, handleServerError } from "../utils";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";
import { UnprocessableEntity, NotFoundError, ForbiddenError } from "../errors";
import Contact, { IContact } from "../database/models/contact.model";

const utapi = new UTApi();

type GetALLResult = {
  success: boolean;
  data: IContact[] | [] | null;
  error: string | null;
  statusCode: number;
};

type DefaultResult = {
  success: boolean;
  data: IContact | null;
  error: string | null;
  statusCode: number;
};

type DeleteResult = {
  success: boolean;
  data: null;
  error: string | null;
  statusCode: number;
};

export async function getAllContacts(): Promise<GetALLResult> {
  try {
    await connectToDb();

    const contacts = await Contact.find();

    const data = JSON.parse(JSON.stringify(contacts));

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

export async function createContact(
  params: CreateContactsParams
): Promise<DefaultResult> {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new ForbiddenError("Not Authorized to access this resource.");

    const newContact = await Contact.create(params);

    if (!newContact)
      throw new UnprocessableEntity("Failed to create the contact.");

    const data = JSON.parse(JSON.stringify(newContact));

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

export async function updateContact(
  params: UpdateContactsParams
): Promise<DefaultResult> {
  const { _id, imgUrl, imgSize, content, newImg } = params;

  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new ForbiddenError("Not Authorized to access this resource.");

    const originalContact = await Contact.findById(_id);

    if (!originalContact)
      throw new NotFoundError("Could not find the original contact.");

    let updatedContact = null;

    if (newImg) {
      const imgName = getImgName(originalContact);
      if (!imgName)
        throw new UnprocessableEntity("Failed to read the image name.");
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

    if (!updatedContact)
      throw new NotFoundError("Failed to update the contact.");

    const data = JSON.parse(JSON.stringify(updatedContact));

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

export async function deleteContact(
  contactId: string,
  revalidate: boolean
): Promise<DeleteResult> {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new ForbiddenError("Not Authorized to access this resource.");

    const deletedContact = await Contact.findByIdAndDelete(contactId);

    if (!deletedContact)
      throw new NotFoundError("Failed to delete the contacts.");

    const imgName = getImgName(deletedContact);
    if (!imgName)
      throw new UnprocessableEntity("Failed to read the image name.");
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

export async function deleteAllContacts(): Promise<DeleteResult> {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new ForbiddenError("Not Authorized to access this resource.");

    const contacts = await Contact.find();

    contacts.map(async (contact) => await deleteContact(contact._id, false));

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
