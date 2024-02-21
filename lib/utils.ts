import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { IPage } from "./database/models/page.model";
import { IService } from "./database/models/service.model";
import { IRecord } from "./database/models/record.model";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleError = (error: unknown): string => {
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

export const generateBackgroundColor = (): string => {
  // Generate a random hue value
  const hue = Math.floor(Math.random() * 360);

  // Generate a random saturation value within a range
  const saturation = Math.floor(Math.random() * 41) + 60; // Range: 60-100

  // Generate a random lightness value within a range
  const lightness = Math.floor(Math.random() * 21) + 40; // Range: 40-60

  // Convert HSL color to RGB color
  const hslToRgb = (
    h: number,
    s: number,
    l: number
  ): [number, number, number] => {
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;

    let rgb: [number, number, number];
    if (h >= 0 && h < 60) {
      rgb = [c, x, 0];
    } else if (h >= 60 && h < 120) {
      rgb = [x, c, 0];
    } else if (h >= 120 && h < 180) {
      rgb = [0, c, x];
    } else if (h >= 180 && h < 240) {
      rgb = [0, x, c];
    } else if (h >= 240 && h < 300) {
      rgb = [x, 0, c];
    } else {
      rgb = [c, 0, x];
    }

    return [
      Math.round((rgb[0] + m) * 255),
      Math.round((rgb[1] + m) * 255),
      Math.round((rgb[2] + m) * 255),
    ];
  };

  // Convert HSL values to RGB
  const [r, g, b] = hslToRgb(hue, saturation / 100, lightness / 100);

  // Convert the RGB components to a hex string
  const hexColor = `#${r.toString(16).padStart(2, "0")}${g
    .toString(16)
    .padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;

  return hexColor;
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
