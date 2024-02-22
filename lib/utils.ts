import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { IPage } from "./database/models/page.model";
import { IService } from "./database/models/service.model";
import { IRecord } from "./database/models/record.model";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleError = (error: unknown): string => {
  console.log("error = ", error);

  throw new Error(typeof error === "string" ? error : JSON.stringify(error));
};

export const findPage = (
  pages: IPage[],
  requiredPage: string
): IPage | Partial<IPage> => {
  const page = pages.find((page) => page.pageName === requiredPage);
  if (!page) return { pageName: requiredPage, pageTitle: "", pageContent: "" };
  return page;
};

export const getPageTitle = (
  page: IPage | Partial<IPage> | undefined,
  isAdmin: boolean | undefined,
  text: string
): string | null => {
  if (page?.pageTitle) return page.pageTitle;
  else if (isAdmin) return text;
  else return null;
};

export const getPageContent = (
  page: IPage | Partial<IPage> | undefined,
  isAdmin: boolean | undefined
): string | null => {
  if (page?.pageContent) return page.pageContent;
  else if (isAdmin) return "Content";
  else return null;
};

export const isValidForm = (obj: any): boolean => {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key].trim();
      if (value === "") return false;
    }
  }
  return true;
};

export const convertFileToUrl = (file: File): string =>
  URL.createObjectURL(file);

export const getImgSize = (file: File): number => {
  return file.size / 1024;
};

export const getImgName = (serviceObj: IService): string | undefined => {
  return new URL(serviceObj.imgUrl).pathname.split("/").pop();
};

export const formatBytes = (
  services: IService[],
  records: IRecord[]
): string => {
  const units = ["B", "KB", "MB", "GB"];
  let size = 0;

  services.forEach((service) => (size += service.imgSize));
  records.forEach((record) => (size += record.imgSize));

  let i = 0;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i++;
  }

  return `${size.toFixed(2)} ${units[i]}`;
};
