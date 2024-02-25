"use server";

import { connectToDb } from "../database";
import { CreateServiceParams, UpdateServiceParams } from "@/types";
import { getImgName, handleError } from "../utils";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";
import Service from "../database/models/service.model";

const utapi = new UTApi();

export async function getAllServices() {
  try {
    await connectToDb();

    const services = await Service.find().sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(services));
  } catch (error) {
    handleError(error);
  }
}

export async function getServiceById(serviceId: string) {
  try {
    await connectToDb();

    const service = await Service.findById(serviceId);
    if (!service) throw new Error("Service not found");

    return JSON.parse(JSON.stringify(service));
  } catch (error) {
    handleError(error);
  }
}

export async function createService(params: CreateServiceParams) {
  const { serviceName, imgUrl, imgSize, serviceContent, path } = params;

  try {
    await connectToDb();

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

    revalidatePath(path);

    return JSON.parse(JSON.stringify(newService));
  } catch (error) {
    handleError(error);
  }
}

export async function updateService(params: UpdateServiceParams) {
  const { _id, serviceName, imgUrl, imgSize, newImg, serviceContent, path } =
    params;

  if (!_id || !serviceName || !imgUrl || !serviceContent || !path) return;

  let updatedService;
  try {
    await connectToDb();

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

    revalidatePath(path);
    return JSON.parse(JSON.stringify(updatedService));
  } catch (error) {
    handleError(error);
  }
}

export async function deleteService(serviceId: string) {
  if (!serviceId) return null;

  try {
    await connectToDb();

    const deletedService = await Service.findByIdAndDelete(serviceId);
    if (!deletedService)
      throw new Error("Service not found or already deleted.");

    const imgName = getImgName(deletedService);
    if (!imgName) throw new Error("Failed to read the image name.");
    await utapi.deleteFiles(imgName);

    revalidatePath("/");

    return "Service deleted successfully";
  } catch (error) {
    handleError(error);
  }
}

export async function deleteAllServices() {
  try {
    await connectToDb();

    const allServices = await Service.find();

    allServices.map(async (service) => await deleteService(service._id));

    revalidatePath("/");

    return "All services deleted successfully";
  } catch (error) {
    handleError(error);
  }
}
