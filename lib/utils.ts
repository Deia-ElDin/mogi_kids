import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { IPage } from "./database/models/page.model";
import { IService } from "./database/models/service.model";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleError = (error: unknown) => {
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
) => {
  if (page?.pageTitle) return page.pageTitle;
  else if (isAdmin) return text;
  else return null;
};

export const getPageContent = (
  page: IPage | Partial<IPage> | undefined,
  isAdmin: boolean | undefined
) => {
  if (page?.pageContent) return page.pageContent;
  else if (isAdmin) return "Content";
  else return null;
};

// export const cleanContent = (content: string) => {
//   return content.replace(/\n+$/, "");
// };

export const isValidForm = (obj: any) => {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key].trim();
      if (value === "") return false;
    }
  }
  return true;
};

export const convertFileToUrl = (file: File) => URL.createObjectURL(file);

export const getImgSize = (file: File): number => {
  return file.size / 1024;
};

export const getImgName = (serviceObj: IService) => {
  return new URL(serviceObj.imgUrl).pathname.split("/").pop();
};
