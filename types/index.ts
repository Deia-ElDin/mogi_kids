// User Params
export type CreateUserParams = {
  clerkId: string;
  firstName: string;
  lastName: string;
  email: string;
  photo: string;
  role: string;
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

// Quotes
export type GetALLQuotesParams = {
  page?: number;
  limit?: number;
}

// Review Params
export type CreateReviewParams = {
  review?: string;
  rating?: string;
  path: string;
  createdBy: string;
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
  reviewId: string;
  path: string;
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
export type CreateReportParams = {
  target: string;
  targetId: string;
  createdBy: string | null;
};
