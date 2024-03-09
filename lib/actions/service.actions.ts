"use server";

import { connectToDb } from "../database";
import { validateAdmin } from "./validation.actions";
import { CreateServiceParams, UpdateServiceParams } from "@/types";
import { getImgName, handleError } from "../utils";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";
import Service, { IService } from "../database/models/service.model";

const utapi = new UTApi();

type GetALLResult = {
  success: boolean;
  data: IService[] | [] | null;
  error: string | null;
};

type DefaultResult = {
  success: boolean;
  data: IService | null;
  error: string | null;
};

type DeleteResult = {
  success: boolean;
  data: null;
  error: string | null;
};

export async function getAllServices(): Promise<GetALLResult> {
  try {
    await connectToDb();

    const services = await Service.find().sort({ createdAt: -1 });

    const data = JSON.parse(JSON.stringify(services));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function getServiceById(
  serviceId: string
): Promise<DefaultResult> {
  try {
    await connectToDb();

    const service = await Service.findById(serviceId);

    if (!service) throw new Error("Service not found");

    const data = JSON.parse(JSON.stringify(service));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function createService(
  params: CreateServiceParams
): Promise<DefaultResult> {
  const { serviceName, imgUrl, imgSize, serviceContent, path } = params;

  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new Error("Not Authorized to access this resource.");

    const newService = await Service.create({
      serviceName,
      imgUrl,
      imgSize,
      serviceContent,
    });

    if (!newService)
      throw new Error(
        "Couldn't create a service & kindly check the uploadthing database"
      );

    const data = JSON.parse(JSON.stringify(newService));

    revalidatePath(path);
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function updateService(
  params: UpdateServiceParams
): Promise<DefaultResult> {
  const { _id, serviceName, imgUrl, imgSize, newImg, serviceContent, path } =
    params;

  let updatedService;

  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new Error("Not Authorized to access this resource.");

    const originalService = await Service.findById(_id);

    if (!originalService)
      throw new Error("Could not find the original service.");

    if (newImg) {
      const imgName = getImgName(originalService);
      if (!imgName) throw new Error("Failed to read the image name.");
      await utapi.deleteFiles(imgName);

      updatedService = await Service.findByIdAndUpdate(
        _id,
        {
          serviceName,
          imgUrl,
          imgSize,
          serviceContent,
        },
        { new: true }
      );
    } else {
      updatedService = await Service.findByIdAndUpdate(
        _id,
        {
          serviceName,
          serviceContent,
        },
        { new: true }
      );
    }

    const data = JSON.parse(JSON.stringify(updatedService));

    revalidatePath(path);
    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function deleteService(
  serviceId: string,
  revalidate: boolean,
  path: string
): Promise<DeleteResult> {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new Error("Not Authorized to access this resource.");

    const deletedService = await Service.findByIdAndDelete(serviceId);

    if (!deletedService)
      throw new Error("Service not found or already deleted.");

    const imgName = getImgName(deletedService);
    if (!imgName) throw new Error("Failed to read the image name.");
    await utapi.deleteFiles(imgName);

    if (revalidate) revalidatePath(path);
    return { success: true, data: null, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function deleteAllServices(): Promise<DeleteResult> {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new Error("Not Authorized to access this resource.");

    const allServices = await Service.find();

    allServices.map(
      async (service) => await deleteService(service._id, false, "/")
    );

    revalidatePath("/");
    return { success: true, data: null, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}
