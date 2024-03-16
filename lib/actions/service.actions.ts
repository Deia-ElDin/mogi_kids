"use server";

import { connectToDb } from "../database";
import { validateAdmin } from "./validation.actions";
import { CreateServiceParams, UpdateServiceParams } from "@/types";
import { getImgName, handleServerError } from "../utils";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";
import { UnprocessableEntity, NotFoundError, ForbiddenError } from "../errors";
import Service, { IService } from "../database/models/service.model";

const utapi = new UTApi();

type GetALLResult = {
  success: boolean;
  data: IService[] | [] | null;
  error: string | null;
  statusCode: number;
};

type DefaultResult = {
  success: boolean;
  data: IService | null;
  error: string | null;
  statusCode: number;
};

type DeleteResult = {
  success: boolean;
  data: null;
  error: string | null;
  statusCode: number;
};

export async function getAllServices(): Promise<GetALLResult> {
  try {
    await connectToDb();

    const services = await Service.find().sort({ createdAt: -1 });

    const data = JSON.parse(JSON.stringify(services));

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

export async function getServiceById(
  serviceId: string
): Promise<DefaultResult> {
  try {
    await connectToDb();

    const service = await Service.findById(serviceId);

    if (!service) throw new NotFoundError("Service not found");

    const data = JSON.parse(JSON.stringify(service));

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

export async function createService(
  params: CreateServiceParams
): Promise<DefaultResult> {
  const { serviceName, imgUrl, imgSize, serviceContent, path } = params;

  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new ForbiddenError("Not Authorized to access this resource.");

    const newService = await Service.create({
      serviceName,
      imgUrl,
      imgSize,
      serviceContent,
    });

    if (!newService)
      throw new UnprocessableEntity(
        "Couldn't create a service & kindly check the uploadthing database"
      );

    const data = JSON.parse(JSON.stringify(newService));

    revalidatePath(path);

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
      throw new ForbiddenError("Not Authorized to access this resource.");

    const originalService = await Service.findById(_id);

    if (!originalService)
      throw new NotFoundError("Could not find the original service.");

    if (newImg) {
      const imgName = getImgName(originalService);
      if (!imgName)
        throw new UnprocessableEntity("Failed to read the image name.");
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

    if (!updatedService) throw new NotFoundError("Failed to update.");

    const data = JSON.parse(JSON.stringify(updatedService));

    revalidatePath(path);

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

export async function deleteService(
  serviceId: string,
  revalidate: boolean,
  path: string
): Promise<DeleteResult> {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new ForbiddenError("Not Authorized to access this resource.");

    const deletedService = await Service.findByIdAndDelete(serviceId);

    if (!deletedService)
      throw new NotFoundError("Service not found or already deleted.");

    const imgName = getImgName(deletedService);
    if (!imgName)
      throw new UnprocessableEntity("Failed to read the image name.");
    await utapi.deleteFiles(imgName);

    if (revalidate) revalidatePath(path);

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

export async function deleteAllServices(): Promise<DeleteResult> {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new ForbiddenError("Not Authorized to access this resource.");

    const allServices = await Service.find();

    allServices.map(
      async (service) => await deleteService(service._id, false, "/")
    );

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
