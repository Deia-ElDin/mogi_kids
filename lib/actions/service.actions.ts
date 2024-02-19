"use server";

import { CreateServiceParams, UpdateServiceParams } from "@/types";
import { connectToDb } from "../database";
import { getImgName, handleError } from "../utils";
import { revalidatePath } from "next/cache";
import { UTApi } from "uploadthing/server";
import Service from "../database/models/service.model";
import Usage from "../database/models/usage.model";

const utapi = new UTApi();

export async function getAllServices() {
  try {
    await connectToDb();

    const services = await Service.find();

    return JSON.parse(JSON.stringify(services));
  } catch (error) {
    handleError(error);
  }
}

export async function getServiceById(serviceId: string) {
  try {
    connectToDb();

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

    const usage = await Usage.updateOne(
      {},
      { $inc: { uploadThingDb: imgSize } },
      { upsert: true }
    );
    if (!usage) throw new Error("Failed to update the database model.");

    revalidatePath(path);

    return JSON.parse(JSON.stringify(newService));
  } catch (error) {
    handleError(error);
  }
}

export async function updateService(params: UpdateServiceParams) {
  const { _id, serviceName, imgUrl, imgSize, serviceContent, path } = params;

  try {
    await connectToDb();

    const servicePage = await Service.findByIdAndUpdate(_id, {
      serviceName,
      imgUrl,
      imgSize,
      serviceContent,
    });

    revalidatePath(path);
    return JSON.parse(JSON.stringify(servicePage));
  } catch (error) {
    handleError(error);
  }
}

export async function deleteService(serviceId: string) {
  try {
    const deletedService = await Service.findByIdAndDelete(serviceId);
    if (!deletedService)
      throw new Error("Service not found or already deleted.");

    const imgName = getImgName(deletedService);
    if (!imgName) throw new Error("Failed to read the image name.");
    await utapi.deleteFiles(imgName);

    const usage = await Usage.updateOne(
      {},
      { $inc: { uploadThingDb: -deletedService.imgSize } },
      { upsert: true }
    );
    if (!usage) throw new Error("Failed to update the database model.");

    revalidatePath("/");

    return null;
  } catch (error) {
    handleError(error);
  }
}

// const updatedServicesPage = await ServicePage.updateOne(
//   {},
//   { $addToSet: { services: newService._id } },
//   { new: true }
// );
// if (!updatedServicesPage) throw new Error("Couldn't find the service page");

// export async function createServicePage(params: CreateServicePageParams) {
//   const { title, content, path } = params;

//   try {
//     await connectToDb();

//     const servicePage = await ServicePage.create({ title, content });

//     revalidatePath(path);
//     return JSON.parse(JSON.stringify(servicePage));
//   } catch (error) {
//     handleError(error);
//   }
// }

// export async function updateServicePage(params: UpdateServicePageParams) {
//   const { _id, title, content, path } = params;

//   try {
//     await connectToDb();

//     const updatedServicePage = await ServicePage.findByIdAndUpdate(_id, {
//       title,
//       content,
//     });

//     revalidatePath(path);
//     return JSON.parse(JSON.stringify(updatedServicePage));
//   } catch (error) {
//     handleError(error);
//   }
// }

// export async function getServicePage() {
//   try {
//     await connectToDb();

//     const servicesPage = await ServicePage.findOne().populate({
//       path: "services",
//     });
//     if (!servicesPage) return null;

//     return JSON.parse(JSON.stringify(servicesPage));
//   } catch (error) {
//     handleError(error);
//   }
// }
