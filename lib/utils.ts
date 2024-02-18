import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { IService } from "./database/models/service.model";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleError = (error: unknown) => {
  throw new Error(typeof error === "string" ? error : JSON.stringify(error));
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
