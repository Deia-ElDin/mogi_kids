"use server";

import { connectToDb } from "../database";
import { CreateContactsParams, UpdateContactsParams } from "@/types";
import { getImgName, handleError } from "../utils";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";
import Contact from "../database/models/contact.model";

const utapi = new UTApi();

export async function getAllContacts() {
  try {
    await connectToDb();

    const contacts = await Contact.find();

    return JSON.parse(JSON.stringify(contacts));
  } catch (error) {
    handleError(error);
  }
}

export async function createContact(params: CreateContactsParams) {
  try {
    await connectToDb();

    console.log("params = ", params);

    const newContact = await Contact.create(params);

    if (!newContact) throw new Error("Failed to create the contact.");

    revalidatePath("/");

    return JSON.parse(JSON.stringify(newContact));
  } catch (error) {
    handleError(error);
  }
}

export async function updateContact(params: UpdateContactsParams) {
  const { _id, imgUrl, content } = params;

  try {
    await connectToDb();

    const updatedContact = await Contact.findByIdAndUpdate(
      _id,
      { imgUrl, content },
      { new: true }
    );

    if (!updatedContact) throw new Error("Failed to update the contacts.");

    revalidatePath("/");

    return JSON.parse(JSON.stringify(updatedContact));
  } catch (error) {
    handleError(error);
  }
}

export async function deleteContact(contactId: string) {
  try {
    await connectToDb();

    const deletedContact = await Contact.findByIdAndDelete(contactId);

    if (!deletedContact) throw new Error("Failed to delete the contacts.");

    const imgName = getImgName(deletedContact);
    if (!imgName) throw new Error("Failed to read the image name.");
    await utapi.deleteFiles(imgName);

    revalidatePath("/");

    return "Contact deleted successfully";
  } catch (error) {
    handleError(error);
  }
}

export async function deleteAllContacts() {
  try {
    const contacts = await Contact.find();

    contacts.map(async (contact) => await deleteContact(contact._id));

    revalidatePath("/");

    return "All contacts deleted successfully";
  } catch (error) {
    handleError(error);
  }
}
