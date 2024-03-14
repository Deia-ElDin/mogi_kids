import { type } from "os";
import { boolean } from "zod";

// User Params
export type CreateUserParams = {
  clerkId: string;
  firstName: string;
  lastName: string;
  email: string;
  photo: string;
  role: string;
};

export type UpdateUserParams = {
  userId: string;
  role?: string;
};

export type GetAllUsersParams = {
  fetch?: {
    firstName?: string;
    email?: string;
    day?: Date | null;
    month?: Date | null;
  };
  page?: number;
  limit?: number;
};

// Logo
export type CreateLogoParams = {
  imgUrl: string;
  imgSize: number;
};

export type UpdateLogoParams = {
  _id: string;
} & CreateLogoParams;

// Gallery
export type CreateGalleryParams = {
  imgUrl: string;
  imgSize: number;
};

export type UpdateGalleryParams = {
  _id: string;
} & CreateLogoParams;

// Page Params
export type CreatePageParams = {
  pageName: string;
  pageTitle: string;
  pageContent?: string;
  path: string;
};

export type UpdatePageParams = {
  _id: string;
} & CreatePageParams;

// Service Params
export type CreateServiceParams = {
  serviceName: string;
  imgUrl: string;
  imgSize: number;
  serviceContent: string;
  path: string;
};

export type UpdateServiceParams = {
  _id: string;
  serviceName: string;
  imgUrl?: string;
  imgSize?: number;
  serviceContent: string;
  newImg: boolean;
  path: string;
};

// Questions Params
export type CreateQuestionParams = {
  question: string;
  answer: string;
};

export type UpdateQuestionParams = {
  _id: string;
} & CreateQuestionParams;

// Records Params
export type CreateRecordParams = {
  imgUrl: string;
  imgSize: number;
  value: string;
  label: string;
};

export type UpdateRecordParams = {
  _id: string;
  imgUrl?: string;
  imgSize?: number;
  value: string;
  label: string;
  newImg?: boolean;
};

// Quotes
export type CreateQuoteParams = {
  cstName: string;
  mobile: string;
  location: string;
  email: string;
  from: Date;
  to: Date;
  numberOfHours: string;
  numberOfKids: string;
  ageOfKidsFrom: string;
  ageOfKidsTo: string;
  extraInfo?: string;
  createdBy?: string | null;
  emailService?: {
    id: string | null;
    error: string | null;
  };
};

export type GetAllQuotesParams = {
  fetch?: {
    cstName?: string;
    email?: string;
    day?: Date | null;
    month?: Date | null;
  };
  page?: number;
  limit?: number;
};

export type UpdateQuoteParams = {
  quoteId: string;
  emailService: { id: string | null; error: string | null };
};

export type UnseenQuotesParams = {
  page?: number;
  limit?: number;
};

export type DeleteSelectedQuoteParams = {
  quoteId: string;
  page?: number;
  limit?: number;
};

export type DeleteSelectedQuotesParams = {
  selectedQuotes: string[];
  page?: number;
  limit?: number;
};

// Career Params
export type GetAllApplicationsParams = {
  fetch?: {
    applicantName?: string;
    email?: string;
    day?: Date | null;
    month?: Date | null;
  };
  page?: number;
  limit?: number;
};

export type CreateApplicationParams = {
  fullName: string;
  email: string;
  mobile: string;
  applyingFor: string;
  workingAt?: string;
  previousSalary?: string;
  expectedSalary?: string;
  joinDate: Date;
  gender: string;
  education: string;
  dhaCertificate: string;
  careGiverCertificate: string;
  experienceInUAE: string[] | [];
  visa: string;
  visaExpireDate: Date;
  coverLetter?: string;
  imgUrl: string;
  imgSize: number;
};

export type DeleteSelectedApplicationParams = {
  applicationId: string;
  page?: number;
  limit?: number;
};

export type DeleteSelectedApplicationsParams = {
  selectedApplications: string[];
  page?: number;
  limit?: number;
};

// Review Params
export type CreateReviewParams = {
  review?: string;
  rating?: string;
  path: string;
};

export type UpdateReviewParams = {
  _id: string;
  review?: string;
  rating?: string;
  path: string;
};

export type ReviewLikesParams = {
  reviewId: string;
  updaterId: string;
  path: string;
};

// Comment Params
export type CreateCommentParams = {
  comment: string;
  reviewId: string;
  createdBy: string;
  path: string;
};

export type UpdateCommentParams = {
  _id: string;
  comment: string;
  path: string;
};

export type DeleteCommentParams = {
  commentId: string;
  reviewId?: string;
  path?: string;
};

export type CommentLikesParams = {
  commentId: string;
  updaterId: string;
  path: string;
};

// Contacts Params
export type CreateContactsParams = {
  imgUrl: string;
  imgSize: number;
  content: string;
};

export type UpdateContactsParams = {
  _id: string;
  imgUrl?: string;
  imgSize?: number;
  content: string;
  newImg?: boolean;
};

// About Us Params
export type CreateAboutUsParams = {
  title: string;
  content: string;
  imgUrl: string;
  imgSize: number;
  path: string;
};

export type UpdateAboutUsParams = {
  _id: string;
  title: string;
  content: string;
  imgUrl?: string;
  imgSize?: number;
  path: string;
  newImg: boolean;
};

// Report Params
export type GetAllReportsParams = {
  fetch?: {
    day?: Date | null;
    month?: Date | null;
  };
  page?: number;
  limit?: number;
};

export type CreateReportParams = {
  target: string;
  targetId: string;
};

export type DeleteSelectedReportParams = {
  reportId: string;
  page?: number;
  limit?: number;
};

export type DeleteSelectedReportsParams = {
  selectedReports: string[];
  page?: number;
  limit?: number;
};

// DB Params
export type DbParams = {
  resend?: boolean;
  uploadthing?: boolean;
  mongo?: boolean;
  clerk?: boolean;
};
