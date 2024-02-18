"use server";

import { revalidatePath } from "next/cache";
import { connectToDb } from "../database";
import { getImgName, handleError } from "../utils";
import {
  CreateServicePageParams,
  UpdateServicePageParams,
  CreateServiceParams,
  UpdateServiceParams,
} from "@/types";
import { utapi } from "../uploadthing";
import ServicePageModel from "../database/models/servicesPage.model";
import ServiceModel from "../database/models/service.model";
import UsageModel from "../database/models/usage.model";

export async function createServicePage(props: CreateServicePageParams) {
  const { title, content, path } = props;

  try {
    await connectToDb();

    const servicePage = await ServicePageModel.create({ title, content });

    revalidatePath(path);
    return JSON.parse(JSON.stringify(servicePage));
  } catch (error) {
    handleError(error);
  }
}

export async function updateServicePage(props: UpdateServicePageParams) {
  const { _id, title, content, path } = props;

  try {
    await connectToDb();

    const updatedServicePage = await ServicePageModel.findByIdAndUpdate(_id, {
      title,
      content,
    });

    revalidatePath(path);
    return JSON.parse(JSON.stringify(updatedServicePage));
  } catch (error) {
    handleError(error);
  }
}

export async function getServicePage() {
  try {
    await connectToDb();

    const servicesPage = await ServicePageModel.findOne().populate({
      path: "services",
    });
    if (!servicesPage) return null;

    return JSON.parse(JSON.stringify(servicesPage));
  } catch (error) {
    handleError(error);
  }
}

export async function createService(props: CreateServiceParams) {
  const { service, imgUrl, imgSize, serviceContent, path } = props;

  try {
    await connectToDb();

    const newService = await ServiceModel.create({
      service,
      imgUrl,
      imgSize,
      serviceContent,
    });
    if (!service) throw new Error("Couldn't create a service");

    const updatedServicesPage = await ServicePageModel.updateOne(
      {},
      { $addToSet: { services: newService._id } },
      { new: true }
    );
    if (!updatedServicesPage) throw new Error("Couldn't find the service page");

    const usage = await UsageModel.updateOne(
      {},
      {
        $inc: { uploadThingDb: imgSize },
      },
      { upsert: true }
    );
    if (!usage) throw new Error("Failed to update the database model.");

    revalidatePath(path);
    return JSON.parse(JSON.stringify(newService));
  } catch (error) {
    handleError(error);
  }
}

export async function updateService(props: UpdateServiceParams) {
  const { _id, service, imgUrl, serviceContent, path } = props;

  try {
    await connectToDb();

    const servicePage = await ServiceModel.create({
      service,
      imgUrl,
      serviceContent,
    });

    revalidatePath(path);
    return JSON.parse(JSON.stringify(servicePage));
  } catch (error) {
    handleError(error);
  }
}

export async function getServiceById(serviceId: string) {
  try {
    connectToDb();

    const service = await ServiceModel.findById(serviceId);
    if (!service) throw new Error("Service not found");

    return JSON.parse(JSON.stringify(service));
  } catch (error) {
    handleError(error);
  }
}

export async function deleteService(serviceId: string) {
  try {
    const deletedService = await ServiceModel.findByIdAndDelete(serviceId);
    if (!deletedService)
      throw new Error("Service not found or already deleted.");

    const updatedServicesPage = await ServicePageModel.updateOne(
      {},
      { $pull: { services: deletedService._id } }
    );
    console.log("updatedServicesPage", updatedServicesPage);

    const imgName = getImgName(deletedService);
    if (!imgName) throw new Error("Failed to read the image name.");
    await utapi.deleteFiles(imgName);

    const usage = await UsageModel.updateOne(
      {},
      {
        $inc: { uploadThingDb: -deletedService.imgSize },
      },
      { upsert: true }
    );
    if (!usage) throw new Error("Failed to update the database model.");

    revalidatePath("/");

    return null;
  } catch (error) {
    handleError(error);
  }
}
