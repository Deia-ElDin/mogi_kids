import * as z from "zod";
import {
  addYears,
  addMonths,
  isAfter,
  isBefore,
  subDays,
  isEqual,
  subMonths,
} from "date-fns";

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

const today = new Date();
let fromDate: Date = today;
let fromAge: number;
let toAge: number;

export const logoSchema = z.object({
  imgUrl: z.string().min(1, "Kindly provide us the the logo image."),
});

export const gallerySchema = z.object({
  imgUrl: z.string().min(1, "Kindly provide us an image."),
});

export const quoteSchema = z.object({
  cstName: z
    .string()
    .min(1, "Kindly provide your name.")
    .max(100, "Name must not exceed 100 characters.")
    .refine(
      (value) => /^[a-zA-Z\s]+$/.test(value),
      "Name must not contain any numbers or special characters."
    )
    .refine((value) => value.trim().length > 0, "Kindly tell us your name."),
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
  location: z
    .string()
    .min(1, "Kindly select your location.")
    .max(60, "Location must not exceed 60 characters."),
  email: z
    .string()
    .min(1, "Kindly provide us your email address.")
    .email("Invalid email address."),

  numberOfHours: z
    .string()
    .min(1, "Kindly let us know how many hours you need.")
    .refine(
      (value) => !value.includes("."),
      "The number of hours must not contain any decimal values."
    )
    .refine((value) => {
      const hours = parseFloat(value);
      return hours >= 1 && hours <= 24;
    }, "The number of hours must be between 1 and 24."),
  numberOfKids: z
    .string()
    .min(1, "Kindly let us know how many kids you have.")
    .refine(
      (value) => !value.includes("."),
      "The number of kids must not contain any decimal values."
    )
    .refine((value) => {
      const kids = parseFloat(value);
      return kids > 0;
    }, "The number of kids must be bigger than 0."),
  ageOfKidsFrom: z
    .string()
    .min(1, "Kindly let us know the age of your youngest kid.")
    .refine(
      (value) => !value.includes("."),
      "Please select the nearest whole number. Decimals are not allowed."
    )
    .refine((value) => {
      const ageFrom = parseFloat(value);
      fromAge = ageFrom;
      return ageFrom > 0 && ageFrom <= 15;
    }, "Kids age must be a positive number and less than or equal to 15."),
  ageOfKidsTo: z
    .string()
    .min(1, "Kindly let us know the age of your oldest kid.")
    .refine(
      (value) => !value.includes("."),
      "Please select the nearest whole number. Decimals are not allowed."
    )
    .refine((value) => {
      const ageTo = parseFloat(value);
      return ageTo > 0 && ageTo <= 15;
    }, "Kids age must be a positive number and less than or equal to 15.")
    .refine((value) => {
      const ageTo = parseFloat(value);
      return ageTo >= fromAge && ageTo <= 15;
    }, "Please ensure the age range begins with the youngest child or remains equal."),
  from: z.date().refine((value) => {
    if (value !== null && value !== undefined) {
      fromDate = value;
      const maxDate = addYears(today, 1);
      return isAfter(value, subDays(today, 1)) && isAfter(maxDate, value);
    }
  }, "The service can't start in the past or exceed a year from now."),
  to: z
    .date()
    .refine((value) => {
      if (value !== null && value !== undefined) {
        return isEqual(value, fromDate) || isAfter(value, fromDate);
      }
    }, "The service can't end in the past or before the service start date.")
    .refine((value) => {
      const maxToDate = addYears(fromDate, 15);
      return isAfter(maxToDate, value);
    }, "The service duration can't exceed 15 years."),
  extraInfo: z.string().max(5000, "maximum 5000 characters."),
});

export const careerSchema = z.object({
  fullName: z
    .string()
    .min(1, "Kindly provide your name.")
    .max(100, "Name must not exceed 100 characters.")
    .refine(
      (value) => /^[a-zA-Z\s]+$/.test(value),
      "Name must not contain any numbers or special characters."
    )
    .refine((value) => value.trim().length > 0, "Kindly tell us your name."),
  email: z
    .string()
    .min(1, "Kindly provide us your email address.")
    .email("Invalid email address."),
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
  applyingFor: z
    .string()
    .min(1, "Kindly tell us which job you are applying for.")
    .max(150, "Field must not exceed 150 characters."),
  workingAt: z
    .string()
    .min(1, "Kindly tell us where are you working at.")
    .max(150, "Field must not exceed 150 characters."),
  previousSalary: z
    .string()
    .max(25, "Field must not exceed 25 characters.")
    .optional(),
  expectedSalary: z
    .string()
    .max(25, "Field must not exceed 25 characters.")
    .optional(),
  joinDate: z.date().refine((value) => {
    if (value !== null && value !== undefined) {
      const today = new Date();
      const maxDate = addMonths(today, 2);
      return isAfter(value, subDays(today, 1)) && isBefore(value, maxDate);
    }
  }, "Joining date can't start in the past or exceed 2 months from now."),
  gender: z.string().min(1, "Kindly select your gender."),
  education: z.string().min(1, "Kindly select your education level."),
  dhaCertificate: z.string().min(1, "Kindly select one of the options below."),
  careGiverCertificate: z
    .string()
    .min(1, "Kindly select one of the options below."),
  experienceInUAE: z.array(z.string()).length(5),
  visa: z.string().min(1, "Kindly select one of the options below."),
  visaExpireDate: z
    .date()
    .refine((value) => value !== null && value !== undefined, {
      message: "Visa expiration date is required.",
    })
    .refine((value) => !isNaN(value.getTime()), {
      message: "Visa expiration date must be a valid date.",
    })
    .refine((value) => {
      const threeMonthsAgo = subMonths(new Date(), 3);
      return isAfter(value, threeMonthsAgo);
    }, "Visa expired since 3 months or more!.")
    .refine((value) => {
      const today = new Date();
      const tenYearsLater = addYears(today, 10);
      return isBefore(value, tenYearsLater);
    }, "Visa expiration date must be within 10 years from today."),
  coverLetter: z
    .string()
    .max(5000, "Field must not exceed 5000 characters.")
    .optional(),
  imgUrl: z.string().min(1, "Kindly attach your CV."),
});

export const pageSchema = z.object({
  pageName: z.string(),
  pageTitle: z.string().min(1, "Kindly provide us a page title."),
  pageContent: z.string().optional(),
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
    .max(1000, "Customers Review can't exceed 1000 letters. Thank you.")
    .refine((value) => value.trim().length > 0, {
      message: "Kindly leave us a review :) Thank you.",
    }),
  rating: z.string(),
});

export const commentSchema = z.object({
  comment: z
    .string()
    .max(1000, "Customers Review can't exceed 1000 letters. Thank you.")
    .refine((value) => value.trim().length > 0, {
      message: "Kindly leave us a comment :) Thank you.",
    }),
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
