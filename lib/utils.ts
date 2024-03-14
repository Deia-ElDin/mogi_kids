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
import { ICareer } from "./database/models/career.model";
import { differenceInDays, isValid, isAfter, isBefore } from "date-fns";
import { QuoteSortKey, ApplicationsSortKey } from "@/constants";

const adminRoles = new Set(["Manager", "Admin"]);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const toCap = (str: string) => {
  return str
    .split(/[\s_]+|(?=[A-Z])/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const handleError = (error: unknown): string => {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  } else if (error && typeof error === "string") {
    return error;
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
  aboutUs: IAboutUs[] | [],
  applications: ICareer[] | []
): string => {
  const units = ["B", "KB", "MB", "GB"];
  let totalBytes = 0;

  totalBytes += logo ? logo.imgSize : 0;
  gallery.forEach((img) => (totalBytes += img.imgSize));
  services.forEach((service) => (totalBytes += service.imgSize));
  records.forEach((record) => (totalBytes += record.imgSize));
  contacts.forEach((contact) => (totalBytes += contact.imgSize));
  aboutUs.forEach((article) => (totalBytes += article.imgSize));
  applications.forEach((application) => (totalBytes += application.imgSize));

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
  lastName: string | undefined | null
) => {
  if (firstName && lastName) return `${toCap(firstName)} ${toCap(lastName)}`;
  else if (firstName) return toCap(firstName);
  else return "Client";
};

export const onlyPositiveValues = (
  evt: React.FormEvent<HTMLInputElement>,
  maxValue?: number
) => {
  let value = parseFloat((evt.target as HTMLInputElement).value);
  if (value <= 1) value = 1;
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
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
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

  if (key === ApplicationsSortKey.GENDER) {
    sortedArray.sort((a, b) => {
      const aValue = a.gender.toLowerCase();
      const bValue = b.gender.toLowerCase();

      if (direction === "ascending") {
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
        return 0;
      } else {
        if (aValue < bValue) return 1;
        if (aValue > bValue) return -1;
        return 0;
      }
    });
  } else if (key === ApplicationsSortKey.DHA) {
    sortedArray.sort((a, b) => {
      const aValue = a.dhaCertificate.toLowerCase();
      const bValue = b.dhaCertificate.toLowerCase();

      if (direction === "ascending") {
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
        return 0;
      } else {
        if (aValue < bValue) return 1;
        if (aValue > bValue) return -1;
        return 0;
      }
    });
  } else if (key === ApplicationsSortKey.CGC) {
    sortedArray.sort((a, b) => {
      const aValue = a.careGiverCertificate.toLowerCase();
      const bValue = b.careGiverCertificate.toLowerCase();

      if (direction === "ascending") {
        if (aValue < bValue) return -1;
        if (aValue > bValue) return 1;
        return 0;
      } else {
        if (aValue < bValue) return 1;
        if (aValue > bValue) return -1;
        return 0;
      }
    });
  } else if (key === ApplicationsSortKey.SALARY) {
    sortedArray.sort((a, b) => {
      const aValue = a.expectedSalary ? parseInt(a.expectedSalary) : 0;
      const bValue = b.expectedSalary ? parseInt(b.expectedSalary) : 0;

      return direction === "ascending" ? aValue - bValue : bValue - aValue;
    });
  } else if (key === ApplicationsSortKey.VISA_EXPIRY_DATE) {
    sortedArray.sort((a, b) => {
      const aValue = new Date(a.joinDate);
      const bValue = new Date(b.joinDate);

      return direction === "ascending"
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    });
  } else if (key === ApplicationsSortKey.JOIN_DATE) {
    sortedArray.sort((a, b) => {
      const aValue = new Date(a.joinDate);
      const bValue = new Date(b.joinDate);

      return direction === "ascending"
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    });
  } else if (key === ApplicationsSortKey.DAYS) {
    sortedArray.sort((a, b) => {
      const aValue = a.expectedSalary ? parseInt(a.expectedSalary) : 0;
      const bValue = b.expectedSalary ? parseInt(b.expectedSalary) : 0;

      return direction === "ascending" ? aValue - bValue : bValue - aValue;
    });
  } else if (key === ApplicationsSortKey.DATE) {
    sortedArray.sort((a, b) => {
      const aValue = new Date(a.createdAt);
      const bValue = new Date(b.createdAt);

      return direction === "ascending"
        ? aValue.getTime() - bValue.getTime()
        : bValue.getTime() - aValue.getTime();
    });
  }

  return sortedArray;
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

export const isValidName = function (value: string): boolean {
  return /^[a-zA-Z\s]+$/.test(value);
};

export const isEmpty = function (value: string): boolean {
  return value.trim().length > 0;
};

export const isValidMobile = function (value: string): boolean {
  return /^(?:\+971|00971|0)(?:2|3|4|6|7|8|9|50|52|54|55|56|58)[0-9]{7}$/.test(
    value
  );
};

export const isInArray = function (value: string, array: string[]) {
  return array.includes(value);
};

export const isValidUrl = function (url: string): boolean {
  return /^(?:https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(url);
};

export const isInRange = function (
  value: number,
  min: number,
  max: number
): boolean {
  return value >= min && value <= max;
};

export const isWithinDateRange = (
  value: Date,
  startDate: Date,
  endDate: Date
): boolean => {
  return (
    isValid(value) && isAfter(value, startDate) && isBefore(value, endDate)
  );
};
