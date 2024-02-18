// User Params
export type CreateUserParams = {
  clerkId: string;
  firstName: string;
  lastName: string;
  email: string;
  photo: string;
  role: string;
};

// WelcomePage Params
export type CreateWelcomePageParams = {
  title: string;
  content: string;
  path: string;
};

export type UpdateWelcomePageParams = {
  _id: string;
  title: string;
  content: string;
  path: string;
};

// ServicePage Params
export type ServiceParams = {
  service: string;
  imgUrl: string;
  serviceContent: string;
};

export type CreateServicePageParams = {
  title: string;
  content: string;
  services: ServiceParams[] | [];
  path: string;
};

export type UpdateServicePageParams = {
  _id: string;
  path: string;
} & CreateServicePageParams;

export type CreateServiceParams = {
  path: string;
  servicesPageId: string,
} & ServiceParams;

export type UpdateServiceParams = {
  _id: string;
  path: string;
} & ServiceParams;
