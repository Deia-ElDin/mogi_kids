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
  serviceName?: string;
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
  number: number;
  label: string;
  backgroundColor: string;
};

export type UpdateRecordParams = {
  _id: string;
} & CreateRecordParams;

// // WelcomePage Params
// export type CreateWelcomePageParams = {
//   title: string;
//   content: string;
//   path: string;
// };

// export type UpdateWelcomePageParams = {
//   _id: string;
//   title: string;
//   content: string;
//   path: string;
// };

// // ServicePage Params
