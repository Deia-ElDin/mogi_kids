import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { IPage } from "./database/models/page.model";
import { ILogo } from "./database/models/logo.model";
import { IService } from "./database/models/service.model";
import { IRecord } from "./database/models/record.model";
import { IGallery } from "./database/models/gallery.model";
import { IQuote } from "./database/models/quote.model";
import { IContact } from "./database/models/contact.model";
import { IAboutUs } from "./database/models/about-us.model";
import { differenceInDays } from "date-fns";
import { QuoteSortKey, ApplicationsSortKey } from "@/constants";
import { ICareer } from "./database/models/career.model";

const adminRoles = new Set(["Manager", "Admin"]);

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

export const isAdminUser = (user: { role: string } | null): boolean => {
  return user !== null && adminRoles.has(user.role);
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
  gallery: IGallery[] | [],
  services: IService[] | [],
  records: IRecord[] | [],
  contacts: IContact[] | [],
  aboutUs: IAboutUs[] | []
): string => {
  const units = ["B", "KB", "MB", "GB"];
  let totalBytes = 0;

  totalBytes += logo ? logo.imgSize : 0;
  gallery.forEach((img) => (totalBytes += img.imgSize));
  services.forEach((service) => (totalBytes += service.imgSize));
  records.forEach((record) => (totalBytes += record.imgSize));
  contacts.forEach((contact) => (totalBytes += contact.imgSize));
  aboutUs.forEach((article) => (totalBytes += article.imgSize));

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

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

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

export const onlyPositiveValues = (
  evt: React.FormEvent<HTMLInputElement>,
  maxValue?: number
) => {
  let value = parseFloat((evt.target as HTMLInputElement).value);
  if (value < 0) value = 0;
  else if (maxValue && value >= maxValue) value = maxValue;
  return value.toString();
};

export const sortQuotes = (
  array: IQuote[],
  key: QuoteSortKey,
  direction: string
) => {
  const sortedArray = [...array];

  if (key === QuoteSortKey.DAYS) {
    sortedArray.sort((a, b) => {
      const aValue = differenceInDays(new Date(a.to), new Date(a.from));
      const bValue = differenceInDays(new Date(b.to), new Date(b.from));
      return direction === "ascending" ? aValue - bValue : bValue - aValue;
    });
  } else if (key === QuoteSortKey.HOURS) {
    sortedArray.sort((a, b) => {
      const aValue = parseInt(a.numberOfHours);
      const bValue = parseInt(b.numberOfHours);
      return direction === "ascending" ? aValue - bValue : bValue - aValue;
    });
  } else if (key === QuoteSortKey.KIDS) {
    sortedArray.sort((a, b) => {
      const aValue = parseInt(a.numberOfKids);
      const bValue = parseInt(b.numberOfKids);
      return direction === "ascending" ? aValue - bValue : bValue - aValue;
    });
  } else if (key === QuoteSortKey.AGES) {
    sortedArray.sort((a, b) => {
      const aValue = parseInt(a.ageOfKidsFrom);
      const bValue = parseInt(b.ageOfKidsFrom);
      return direction === "ascending" ? aValue - bValue : bValue - aValue;
    });
  } else if (key === QuoteSortKey.TOTAL_HOURS) {
    sortedArray.sort((a, b) => {
      const aValue =
        differenceInDays(new Date(a.to), new Date(a.from)) *
        parseInt(a.numberOfHours);
      const bValue =
        differenceInDays(new Date(b.to), new Date(b.from)) *
        parseInt(b.numberOfHours);
      return direction === "ascending" ? aValue - bValue : bValue - aValue;
    });
  } else if (key === QuoteSortKey.DATE) {
    sortedArray.sort((a, b) => {
      const aValue = new Date(a.createdAt);
      const bValue = new Date(b.createdAt);

      return direction === "ascending"
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue);
    });
  }
  return sortedArray;
};

export const sortApplications = (
  array: ICareer[],
  key: ApplicationsSortKey,
  direction: string
) => {
  const sortedArray = [...array];

  if (key === ApplicationsSortKey.DATE) {
    sortedArray.sort((a, b) => {
      const aValue = new Date(a.createdAt);
      const bValue = new Date(b.createdAt);

      return direction === "ascending"
        ? Number(aValue) - Number(bValue)
        : Number(bValue) - Number(aValue);
    });
  }
  return sortedArray;
};

export const toCap = (str: string) => {
  return str
    .split(/[\s_]+|(?=[A-Z])/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

// Database Validations Function
export const isValidString = (value: string, maxLength: number) => {
  return (
    value &&
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= maxLength
  );
};

export const isInRange = (value: number, min: number, max: number) => {
  return value >= min && value <= max;
};
