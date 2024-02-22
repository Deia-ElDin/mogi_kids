// User Params
export type CreateUserParams = {
  clerkId: string;
  firstName: string;
  lastName: string;
  email: string;
  photo: string;
  role: string;
};

// Page Params
export type CreatePageParams = {
  pageName: string;
  pageTitle: string;
  pageContent: string;
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
  svgUrl: string;
  imgSize: number;
  value: string;
  label: string;
  backgroundColor?: string;
};

export type UpdateRecordParams = {
  _id: string;
  svgUrl?: string;
  imgSize?: number;
  value: string;
  label: string;
  backgroundColor?: string;
  newImg: boolean;
};

// Review Params
export type CreateReviewParams = {
  review?: string;
  rating?: string;
  user: { _id: string; firstName: string; lastName?: string; photo?: string };
};

export type UpdateReviewParams = {
  _id: string;
} & CreateReviewParams;

// Contacts Params
export type CreateContactsParams = {
  svgUrl: string;
  imgSize: number;
  content: string;
};

export type UpdateContactsParams = {
  _id: string;
} & CreateContactsParams;
