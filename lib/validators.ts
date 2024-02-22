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
  pageTitle: z.string().min(1, "Kindly provide us a page title."),
  pageContent: z.string(),
});

export const serviceSchema = z.object({
  serviceName: z.string().min(1, "Kindly provide us a service name."),
  imgUrl: z.string().min(1, "Kindly provide us a service image."),
  serviceContent: z.string().min(1, "Kindly provide us a service content."),
});

export const questionSchema = z.object({
  question: z.string().min(1, "Kindly provide us a question."),
  answer: z.string().min(1, "Kindly provide us an answer."),
});

export const recordSchema = z.object({
  imgUrl: z.string().min(1, "Kindly provide us the record svg icon."),
  value: z.string().min(1, "Kindly provide us the record number."),
  label: z.string().min(1, "Kindly provide us the record label."),
  // .min(1)
  // .refine(
  //   (value) => {
  //     return value === undefined || /^#[0-9A-Fa-f]{3}$/.test(value);
  //   },
  //   {
  //     message:
  //       "Background color must start with '#' & (0 - 9, a - f, A - F), i.e. #ffeae6",
  //   }
  // ),
});

export const contactSchema = z.object({
  imgUrl: z.string().min(1, "Kindly provide us the contact svg icon."),
  content: z.string().min(1, "Kindly provide us the contact content."),
});
