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
  imgUrl: string;
  imgSize: number;
  content: string;
};

export type UpdateContactsParams = {
  _id: string;
} & CreateContactsParams;

// Quote Params
export type CreateQuoteParams = {
  cstName: string;
  mobile: string;
  location?: string;
  email: string;
  from: Date;
  to: Date;
  numberOfHours: string;
  numberOfKids: string;
  ageOfKidsFrom: string;
  ageOfKidsTo: string;
  extraInfo?: string;
  emailService: {
    id: string | null;
    error: string | null;
  };
};
