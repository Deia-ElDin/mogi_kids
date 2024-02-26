import * as z from "zod";
import { today } from "@/constants";
import { setDate } from "./utils";

let fromDate: Date = today;
let toDate: Date = today;
let fromAge: number;

// const [formErrors, setFormErrors] = useState({});

// const handleSubmit = (event) => {
//   event.preventDefault();
//   const validationResult = quoteSchema.safeParse(formData);
//   if (validationResult.success) {
//     // Form data is valid, you can proceed with submission
//     console.log("Form data is valid:", formData);
//   } else {
//     // Form data is invalid, update the errors state
//     setFormErrors(validationResult.error.flatten().fieldErrors);
//   }
// };

export const quoteSchema = z.object({
  cstName: z
    .string()
    .min(1, "Kindly provide your name.")
    .max(20, "Name must not exceed 20 characters.")
    .refine(
      (value) => /^[a-zA-Z\s]+$/.test(value),
      "Name must not contain any numbers or special characters."
    ),
  mobile: z
    .string()
    .min(1, "Kindly provide your mobile number.")
    .max(14, "Mobile / landline number must not exceed 14 characters.")
    .refine(
      (value) =>
        /^(?:\+971|00971|0)(?:2|3|4|6|7|8|9|50|52|54|55|56|58)[0-9]{7}$/.test(
          value
        ),
      "Invalid mobile number."
    ),
  location: z.string().max(150, "Location must not exceed 60 characters."),
  email: z
    .string()
    .min(1, "Kindly provide your email address.")
    .email("Invalid email address."),
  from: z.date().refine((value) => {
    if (value !== null && value !== undefined) {
      fromDate = setDate(value);
      return value >= today;
    }
  }, "The service can't start in the past."),
  to: z.date().refine((value) => {
    if (value !== null && value !== undefined) {
      toDate = setDate(value);
      return value >= fromDate && value >= today;
    }
  }, "The service can't end in the past."),
  numberOfHours: z
    .string()
    .min(1, "Kindly let us know how many hours you need.")
    .refine((value) => {
      const hours = parseInt(value);
      return hours >= 1 && hours <= 24;
    }, "The number of hours must be between 1 and 24."),
  numberOfKids: z
    .string()
    .min(1, "Kindly let us know how many kids you have.")
    .refine((value) => {
      const kids = parseInt(value);
      return kids > 0;
    }, "The number of kids must be bigger than 0."),
  ageOfKidsFrom: z
    .string()
    .min(1, "Kindly let us know the age of your youngest kid.")
    .refine((value) => {
      const ageFrom = parseInt(value);
      fromAge = ageFrom;
      return ageFrom <= 17;
    }, "Kids age must be less than 18."),
  ageOfKidsTo: z
    .string()
    .min(1, "Kindly let us know the age of your oldest kid.")
    .refine((value) => {
      const ageTo = parseInt(value);
      return ageTo <= 17;
    }, "Kids age must be less than 18.")
    .refine((value) => {
      const ageTo = parseInt(value);
      return ageTo >= fromAge;
    }, "Please ensure the age range begins with the youngest child or remains equal."),
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
});

export const reviewSchema = z.object({
  review: z
    .string()
    .min(1, "Kindly leave us a comment :) Thank you.")
    .max(1000, "Customers Review can't exceed 1000 letters. Thank you."),
  rating: z.string(),
});

export const commentSchema = z.object({
  comment: z
    .string()
    .min(1, "Kindly provide us a comment.")
    .max(1000, "Comments can't exceed 1000 letters. Thank you."),
});

export const contactSchema = z.object({
  imgUrl: z.string().min(1, "Kindly provide us the contact svg icon."),
  content: z.string().min(1, "Kindly provide us the contact content."),
});

export const aboutUsSchema = z.object({
  title: z.string().min(1, "Kindly provide us the article title."),
  content: z.string().min(1, "Kindly provide us the article content."),
  imgUrl: z.string().min(1, "Kindly provide us the article image."),
});
