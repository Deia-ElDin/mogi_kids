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
