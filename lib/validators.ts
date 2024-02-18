import * as z from "zod";

export const quoteSchema = z.object({
  fullName: z
    .string()
    .min(15, "Full name must be at least of 15 characters.")
    .max(100, "Full name must not exceed 100 characters."),
  mobile: z
    .string()
    .min(9, "Mobile / landline number must be at least 9 characters.")
    .max(25, "Mobile / landline number not exceed 25 characters."),
  location: z
    .string()
    .min(3, "Location must be at least 3 characters.")
    .max(150, "Location must not exceed 60 characters."),
  email: z.string({ required_error: "Please select an email" }).email(),
  from: z.date(),
  to: z.date(),
  numberOfHours: z.string(),
  numberOfKids: z.string(),
  ageOfKidsFrom: z.string(),
  ageOfKidsTo: z.string(),
  extraInfo: z.string().max(5000, "maximum 5000 characters."),
});

export const careerSchema = z.object({
  fullName: z
    .string()
    .min(15, "Full name must be at least of 15 characters.")
    .max(100, "Full name must not exceed 100 characters."),
  email: z.string({ required_error: "Please select an email" }).email(),
  mobile: z
    .string()
    .min(9, "Mobile / landline number must be at least 9 characters.")
    .max(25, "Mobile / landline number not exceed 25 characters."),
  applyingFor: z
    .string()
    .min(3, "Career must be at least 3 characters.")
    .max(150, "Career must not exceed 150 characters."),
  workingAt: z
    .string()
    .min(3, "Current job must be at least 3 characters.")
    .max(150, "Current job must not exceed 150 characters."),
  salary: z
    .string()
    .min(3, "Salary must be at least 3 characters.")
    .max(25, "Salary must not exceed 25 characters."),
  joinDate: z.date(),
  skills: z
    .string()
    .min(3, "Skills must be at least 3 characters.")
    .max(1000, "Skills must not exceed 1000 characters."),
  gender: z.string({
    required_error: "Please select your gender.",
  }),
  education: z.string({
    required_error: "Please select education level.",
  }),
  dha: z.string({
    required_error: "Kindly select one.",
  }),
  coverLetter: z
    .string()
    .min(3, "Skills must be at least 3 characters.")
    .max(1000, "Skills must not exceed 1000 characters."),
  // resume: z.object({
  //   fileName: z.string(),
  //   fileType: z.string(),
  //   fileSize: z.number(),
  // }),
});

export const pageSchema = z.object({
  pageName: z.string(),
  pageTitle: z.string().min(3, "Kindly provide us a page title."),
  pageContent: z.string(),
});

export const homePageSchema = z.object({
  title: z
    .string()
    .min(3, "Welcome section title must be at least 3 characters."),
  content: z
    .string()
    .min(3, "Welcome section content must be at least 3 characters."),
});

export const servicePageSchema = z.object({
  title: z.string().min(3, "Service page title must be at least 3 characters."),
  content: z
    .string()
    .min(3, "Service page content must be at least 3 characters."),
  services: z.array(
    z.object({
      service: z.string().min(3, "Kindly provide us a service name."),
      imgUrl: z.string().min(3, "Kindly provide us a service image."),
      serviceContent: z.string().min(3, "Kindly provide us a service content."),
    })
  ),
});

export const addServiceSchema = z.object({
  service: z.string().min(3, "Kindly provide us a service name."),
  imgUrl: z.string().min(3, "Kindly provide us a service image."),
  serviceContent: z.string().min(3, "Kindly provide us a service content."),
});

export const questionSchema = z.object({
  question: z.string().min(3, "Question must be at least 3 characters."),
  answer: z.string().min(3, "Answer must be at least 3 characters."),
});
