import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { IPage } from "./database/models/page.model";
import { ILogo } from "./database/models/logo.model";
import { IService } from "./database/models/service.model";
import { IRecord } from "./database/models/record.model";
import { IGallery } from "./database/models/gallery.model";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleError = (error: unknown): string => {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  } else {
    return "An unknown error occurred";
  }
};

export const findPage = (
  pages: IPage[],
  requiredPage: string
): IPage | Partial<IPage> => {
  const page = pages.find((page) => page.pageName === requiredPage);
  if (page) return page;
  return { pageName: requiredPage, pageTitle: "", pageContent: "" };
};

export const getPageTitle = (
  page: IPage | Partial<IPage> | null,
  isAdmin: boolean | undefined,
  text: string
): string | null => {
  if (page?.pageTitle) return page.pageTitle;
  else if (isAdmin) return text;
  else return null;
};

export const getPageContent = (
  page: IPage | Partial<IPage> | null,
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

export const splitImgName = (url: string) => {
  return new URL(url).pathname.split("/").pop();
};
export const getImgName = (obj: any): string | undefined => {
  return new URL(obj.imgUrl).pathname.split("/").pop();
};

export const formatBytes = (
  logo: ILogo | null,
  gallery: IGallery[] | [] | IGallery | null,
  services: IService[] | [] | IService | null,
  records: IRecord[]
): string => {
  const units = ["B", "KB", "MB", "GB"];
  let totalBytes = 0;

  totalBytes += logo ? logo.imgSize : 0;
  if (gallery && Array.isArray(gallery) && gallery.length > 0)
    gallery.forEach((img) => (totalBytes += img.imgSize));
  if (services && Array.isArray(services) && services.length > 0)
    services.forEach((service) => (totalBytes += service.imgSize));
  records.forEach((record) => (totalBytes += record.imgSize));

  let i = 0;
  while (totalBytes >= 1000 && i < units.length - 1) {
    totalBytes /= 1000;
    i++;
  }

  return `${totalBytes.toFixed(2)} ${units[i]}`;
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

export function postedSince(dateString: string): string {
  const date = new Date(dateString);
  const currentDate = new Date();

  date.setHours(0, 0, 0, 0);
  currentDate.setHours(0, 0, 0, 0);

  const diffMs = currentDate.getTime() - date.getTime();

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";

  if (diffDays === 1) return "Yesterday";

  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  const diffMonths = Math.floor(diffDays / 30);

  if (diffMonths === 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  if (diffMonths < 12)
    return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;

  const diffYears = Math.floor(diffMonths / 12);

  return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
}

export const getUsername = (
  firstName: string | undefined,
  lastName: string | undefined
) => {
  if (firstName && lastName) return `${firstName} ${lastName}`;
  else if (firstName) return firstName;
  else return "Customer";
};
