"use server";

import { revalidatePath } from "next/cache";
import { connectToDb } from "../database";
import { handleError } from "../utils";
import {
  CreateServicePageParams,
  UpdateServicePageParams,
  CreateServiceParams,
  UpdateServiceParams,
} from "@/types";
import ServicePage from "../database/models/servicesPage.model";
import Service from "../database/models/service.model";

export async function createServicePage(props: CreateServicePageParams) {
  const { title, content, path } = props;

  try {
    await connectToDb();

    const servicePage = await ServicePage.create({ title, content });

    revalidatePath(path);
    return JSON.parse(JSON.stringify(servicePage));
  } catch (error) {
    handleError(error);
  }
}

export async function updateServicePage(props: UpdateServicePageParams) {
  const { _id, title, content, path } = props;
  console.log("props", props);

  try {
    await connectToDb();

    const updatedServicePage = await ServicePage.findByIdAndUpdate(_id, {
      title,
      content,
    });
    console.log("updatedServicePage", updatedServicePage);
    revalidatePath(path);
    return JSON.parse(JSON.stringify(updatedServicePage));
  } catch (error) {
    handleError(error);
  }
}

export async function getServicePage() {
  try {
    await connectToDb();

    const servicePage = await ServicePage.find().populate({
      path: "services",
    });
    if (!servicePage?.length) return null;
    return JSON.parse(JSON.stringify(servicePage[0]));
  } catch (error) {
    handleError(error);
  }
}

export async function createService(props: CreateServiceParams) {
  const { service, imgUrl, serviceContent, servicesPageId, path } = props;

  try {
    await connectToDb();

    const newService = await Service.create({
      service,
      imgUrl,
      serviceContent,
    });

    if (!service) throw new Error("Couldn't create a service");

    const updatedServicesPage = await ServicePage.findOneAndUpdate(
      { _id: servicesPageId },
      { $addToSet: { services: newService._id } },
      { new: true }
    );

    if (!updatedServicesPage) throw new Error("Couldn't find the service page");

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

    const servicePage = await Service.create({
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

    const service = await Service.findById(serviceId);

    if (!service) throw new Error("Service not found");

    return JSON.parse(JSON.stringify(service));
  } catch (error) {
    handleError(error);
  }
}

export async function deleteService(serviceId: string) {
  try {
    connectToDb();

    const deletedService = await Service.findByIdAndDelete(serviceId);

    if (!deletedService)
      throw new Error("Service not found or already deleted");

    return JSON.parse(JSON.stringify(deletedService));
  } catch (error) {
    handleError(error);
  }
}
