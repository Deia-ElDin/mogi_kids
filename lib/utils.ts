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

export const setDate = (someDate: Date) => {
  const newData = someDate;
  newData.setHours(0, 0, 0, 0);
  return newData;
};

export const formatDate = (date: Date): string => {
  const day: string = String(date.getDate()).padStart(2, "0");
  const month: string = String(date.getMonth() + 1).padStart(2, "0");
  const year: number = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export function formatMongoDbDate(dateString: string): string {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

export function formatMongoDbDateInDays(dateString: string): string {
  const date = new Date(dateString);
  const currentDate = new Date();

  // Calculate the difference in milliseconds
  const differenceMs = currentDate.getTime() - date.getTime();

  // Convert milliseconds to days
  const differenceDays = Math.floor(differenceMs / (1000 * 60 * 60 * 24));

  // If the difference is less than 1 day, return "Today"
  if (differenceDays < 1) {
    return "Today";
  }

  // If the difference is less than 7 days, return "X days ago"
  if (differenceDays < 7) {
    return `${differenceDays} day${differenceDays > 1 ? "s" : ""} ago`;
  }

  // If the difference is less than 30 days, return "X weeks ago"
  if (differenceDays < 30) {
    const weeks = Math.floor(differenceDays / 7);
    return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  }

  // If the difference is less than 365 days, return "X months ago"
  if (differenceDays < 365) {
    const months = Math.floor(differenceDays / 30);
    return `${months} month${months > 1 ? "s" : ""} ago`;
  }

  // Otherwise, return "X years ago"
  const years = Math.floor(differenceDays / 365);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}
