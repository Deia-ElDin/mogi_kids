import * as z from "zod";
import {
  addYears,
  addMonths,
  isAfter,
  isBefore,
  subDays,
  subMonths,
} from "date-fns";
import { isDecimal } from "validator";
import { today, quoteLocationsArr } from "@/constants";
import {
  isValidName,
  isEmpty,
  isValidMobile,
  isInArray,
  isInRange,
  isWithinDateRange,
  isValidUrl,
} from "@/lib/utils";
import {
  logoErrs,
  galleryErrs,
  webPageErrs,
  serviceErrs,
  questionErrs,
  recordErrs,
  reviewErrs,
  commentsErrs,
  quoteErrs,
  contactErrs,
  aboutUsErrs,
  careerErrs,
} from "@/constants/errors";

export const logoSchema = z.object({
  imgUrl: z
    .string()
    .min(logoErrs.length.min, logoErrs.errs.min)
    .refine((value) => !isValidUrl(value), logoErrs.errs.invalid),
});

export const gallerySchema = z.object({
  imgUrl: z
    .string()
    .min(galleryErrs.length.min, galleryErrs.errs.min)
    .refine((value) => !isValidUrl(value), galleryErrs.errs.invalid),
});

const { serviceName, imgUrl: serviceImg, serviceContent } = serviceErrs;

const { question, answer } = questionErrs;

const { imgUrl: recordImg, value, label } = recordErrs;

const { review } = reviewErrs;

const { comment } = commentsErrs;

const {
  cstName,
  mobile,
  location,
  email,
  hours,
  kids,
  age,
  serviceDates,
  extraInfo,
} = quoteErrs;

const { imgUrl: contactImg, content } = contactErrs;

const { title, content: aboutContent, imgUrl: aboutImg } = aboutUsErrs;

export const pageSchema = z.object({
  pageName: z.string(),
  pageTitle: z.string().min(webPageErrs.length.min, webPageErrs.err),
  pageContent: z.string().optional(),
});

export const serviceSchema = z.object({
  serviceName: z.string().min(serviceName.length.min, serviceName.errs.min),
  imgUrl: z
    .string()
    .min(serviceImg.length.min, serviceImg.errs.min)
    .refine((value) => !isValidUrl(value), serviceImg.errs.invalid),
  serviceContent: z
    .string()
    .min(serviceContent.length.min, serviceContent.errs.min),
});

export const questionSchema = z.object({
  question: z.string().min(question.length.min, question.errs.min),
  answer: z.string().min(answer.length.min, answer.errs.min),
});

export const recordSchema = z.object({
  imgUrl: z
    .string()
    .min(recordImg.length.min, recordImg.errs.min)
    .refine((value) => !isValidUrl(value), recordImg.errs.invalid),
  value: z.string().min(value.length.min, value.errs.min),
  label: z.string().min(label.length.min, label.errs.min),
});

export const reviewSchema = z.object({
  review: z
    .string()
    .min(review.length.min, review.errs.min)
    .max(review.length.max, `${review.errs.max}. Thank you.`)
    .refine((value) => isEmpty(value), `${review.errs.empty} Thank you.`),
  rating: z.string(),
});

export const commentSchema = z.object({
  comment: z
    .string()
    .min(comment.length.min, comment.errs.min)
    .max(comment.length.max, `${comment.errs.max}. Thank you.`)
    .refine((value) => isEmpty(value), `${comment.errs.empty} Thank you.`),
});

export const quoteSchema = z.object({
  cstName: z
    .string()
    .min(cstName.length.min, cstName.errs.min)
    .max(cstName.length.max, cstName.errs.max)
    .refine((value) => isValidName(value), cstName.errs.specialChars)
    .refine((value) => isEmpty(value), cstName.errs.empty),
  mobile: z
    .string()
    .min(mobile.length.min, mobile.errs.min)
    .max(mobile.length.max, mobile.errs.max)
    .refine((value) => isValidMobile(value), mobile.errs.invalid),
  location: z
    .string()
    .min(location.length.min, location.errs.min)
    .max(location.length.max, location.errs.max)
    .refine(
      (value) => isInArray(value, quoteLocationsArr),
      location.errs.invalid
    ),
  email: z
    .string()
    .min(email.length.min, email.errs.min)
    .max(email.length.max, email.errs.max)
    .email(email.errs.invalid),
  numberOfHours: z
    .string()
    .min(hours.length.min, hours.errs.min)
    .max(hours.length.max, hours.errs.max)
    .refine((value) => isDecimal(value), hours.errs.invalid)
    .refine(
      (value) => isInRange(parseInt(value), hours.values.min, hours.values.max),
      hours.errs.range
    ),
  numberOfKids: z
    .string()
    .min(kids.length.min, kids.errs.min)
    .max(kids.length.max, kids.errs.max)
    .refine((value) => isDecimal(value), kids.errs.invalid)
    .refine(
      (value) => isInRange(parseInt(value), kids.values.min, kids.values.max),
      hours.errs.range
    ),
  ageOfKidsFrom: z
    .string()
    .min(age.length.min, age.errs.from.min)
    .max(age.length.max, age.errs.max)
    .refine((value) => isDecimal(value), age.errs.invalid)
    .refine(
      (value) => isInRange(parseInt(value), age.values.min, age.values.max),
      age.errs.range
    ),
  ageOfKidsTo: z
    .string()
    .min(age.length.min, age.errs.to.min)
    .max(age.length.max, age.errs.max)
    .refine((value) => isDecimal(value), age.errs.invalid)
    .refine(
      (value) => isInRange(parseInt(value), age.values.min, age.values.max),
      age.errs.range
    ),
  from: z
    .date()
    .refine(
      (value) =>
        isWithinDateRange(value, subDays(today, 1), addYears(today, 1)),
      serviceDates.errs.from.invalid
    ),
  to: z
    .date()
    .refine(
      (value) => isAfter(value, subDays(today, 1)),
      serviceDates.errs.to.invalid
    )
    .refine(
      (value) =>
        isWithinDateRange(
          value,
          subDays(today, 1),
          addYears(today, serviceDates.values.max)
        ),
      serviceDates.errs.to.duration
    ),
  extraInfo: z.string().max(extraInfo.length.max, extraInfo.errs.max),
});

export const contactSchema = z.object({
  imgUrl: z
    .string()
    .min(contactImg.length.min, contactImg.errs.min)
    .refine((value) => !isValidUrl(value), contactImg.errs.invalid),
  content: z.string().min(content.length.min, content.errs.min),
});

export const aboutUsSchema = z.object({
  title: z.string().min(title.length.min, title.errs.min),
  content: z.string().min(aboutContent.length.min, aboutContent.errs.min),
  imgUrl: z
    .string()
    .min(aboutImg.length.min, aboutImg.errs.min)
    .refine((value) => !isValidUrl(value), aboutImg.errs.invalid),
});

const {
  fullName,
  workingAt,
  applyingFor,
  joinDate,
  previousSalary,
  expectedSalary,
  gender,
  education,
  dha,
  cgc,
  visa,
  visaExpiryDate,
  coverLetter,
  imgUrl: resumePdf,
} = careerErrs;

export const careerSchema = z.object({
  fullName: z
    .string()
    .min(fullName.length.min, fullName.errs.min)
    .max(fullName.length.max, fullName.errs.max)
    .refine((value) => isValidName(value), fullName.errs.specialChars)
    .refine((value) => isEmpty(value), fullName.errs.empty),
  email: z
    .string()
    .min(email.length.min, email.errs.min)
    .max(email.length.max, email.errs.max)
    .email(email.errs.invalid),
  mobile: z
    .string()
    .min(mobile.length.min, mobile.errs.min)
    .max(mobile.length.max, mobile.errs.max)
    .refine((value) => isValidMobile(value), mobile.errs.invalid),
  workingAt: z
    .string()
    .max(workingAt.length.max, workingAt.errs.max)
    .optional(),
  applyingFor: z
    .string()
    .min(applyingFor.length.min, applyingFor.errs.min)
    .max(applyingFor.length.max, applyingFor.errs.max),
  joinDate: z
    .date()
    .refine(
      (value) =>
        isWithinDateRange(value, subDays(today, 1), addMonths(today, 2)),
      joinDate.errs.invalid
    ),
  previousSalary: z
    .string()
    .max(previousSalary.length.max, previousSalary.errs.max)
    .optional(),
  expectedSalary: z
    .string()
    .max(expectedSalary.length.max, expectedSalary.errs.max)
    .optional(),
  experienceInUAE: z.array(z.string()).length(5),
  gender: z
    .string()
    .min(gender.length.min, gender.errs.min)
    .max(gender.length.max, gender.errs.max),
  education: z
    .string()
    .min(education.length.min, education.errs.min)
    .max(education.length.max, education.errs.max),
  dhaCertificate: z
    .string()
    .min(dha.length.min, dha.errs.min)
    .max(dha.length.max, dha.errs.max),
  careGiverCertificate: z
    .string()
    .min(cgc.length.min, cgc.errs.min)
    .max(cgc.length.max, cgc.errs.max),
  visa: z
    .string()
    .min(visa.length.min, visa.errs.min)
    .max(visa.length.max, visa.errs.max),
  visaExpireDate: z
    .date()
    .refine(
      (value) => isAfter(value, subMonths(today, 3)),
      visaExpiryDate.errs.invalid.threeMonths
    )
    .refine(
      (value) => isBefore(value, addYears(today, 10)),
      visaExpiryDate.errs.invalid.tenYears
    ),
  coverLetter: z.string().max(coverLetter.length.max, coverLetter.errs.max),
  imgUrl: z.string().min(resumePdf.length.min, resumePdf.errs.min),
});

// export const careerSchema = z.object({
//   workingAt: z
//     .string()
//     .max(150, "Field must not exceed 150 characters.")
//     .optional(),
//   previousSalary: z
//     .string()
//     .max(25, "Field must not exceed 25 characters.")
//     .optional(),
//   expectedSalary: z
//     .string()
//     .max(25, "Field must not exceed 25 characters.")
//     .optional(),
//   joinDate: z.date().refine((value) => {
//     if (value !== null && value !== undefined) {
//       const today = new Date();
//       const maxDate = addMonths(today, 2);
//       return isAfter(value, subDays(today, 1)) && isBefore(value, maxDate);
//     }
//   }, "Joining date can't start in the past or exceed 2 months from now."),
//   gender: z.string().min(1, "Kindly select your gender."),
//   education: z.string().min(1, "Kindly select your education level."),
//   dhaCertificate: z.string().min(1, "Kindly select one of the options below."),
//   careGiverCertificate: z
//     .string()
//     .min(1, "Kindly select one of the options below."),
//   experienceInUAE: z.array(z.string()).length(5),
//   visa: z.string().min(1, "Kindly select one of the options below."),
//   visaExpireDate: z
//     .date()
//     .refine((value) => value !== null && value !== undefined, {
//       message: "Visa expiration date is required.",
//     })
//     .refine((value) => !isNaN(value.getTime()), {
//       message: "Visa expiration date must be a valid date.",
//     })
//     .refine((value) => {
//       const threeMonthsAgo = subMonths(new Date(), 3);
//       return isAfter(value, threeMonthsAgo);
//     }, "Visa expired since 3 months or more!.")
//     .refine((value) => {
//       const today = new Date();
//       const tenYearsLater = addYears(today, 10);
//       return isBefore(value, tenYearsLater);
//     }, "Visa expiration date must be within 10 years from today."),
//   coverLetter: z
//     .string()
//     .max(5000, "Field must not exceed 5000 characters.")
//     .optional(),
//   imgUrl: z.string().min(1, "Kindly attach your CV."),
// });

// export const careerSchema = z.object({
//   fullName: z
//     .string()
//     .min(1, "Kindly provide your name.")
//     .max(100, "Name must not exceed 100 characters.")
//     .refine(
//       (value) => /^[a-zA-Z\s]+$/.test(value),
//       "Name must not contain any numbers or special characters."
//     )
//     .refine((value) => value.trim().length > 0, "Kindly tell us your name."),
//   email: z
//     .string()
//     .min(1, "Kindly provide us your email address.")
//     .max(100, "Email must not exceed 100 characters.")
//     .email("Invalid email address."),
//   mobile: z
//     .string()
//     .min(1, "Kindly provide your mobile number.")
//     .max(14, "Mobile / landline number must not exceed 14 characters.")
//     .refine(
//       (value) =>
//         /^(?:\+971|00971|0)(?:2|3|4|6|7|8|9|50|52|54|55|56|58)[0-9]{7}$/.test(
//           value
//         ),
//       "Invalid mobile number."
//     ),
//   applyingFor: z
//     .string()
//     .min(1, "Kindly tell us which job you are applying for.")
//     .max(150, "Field must not exceed 150 characters."),
//   workingAt: z
//     .string()
//     .max(150, "Field must not exceed 150 characters.")
//     .optional(),
//   previousSalary: z
//     .string()
//     .max(25, "Field must not exceed 25 characters.")
//     .optional(),
//   expectedSalary: z
//     .string()
//     .max(25, "Field must not exceed 25 characters.")
//     .optional(),
//   joinDate: z.date().refine((value) => {
//     if (value !== null && value !== undefined) {
//       const today = new Date();
//       const maxDate = addMonths(today, 2);
//       return isAfter(value, subDays(today, 1)) && isBefore(value, maxDate);
//     }
//   }, "Joining date can't start in the past or exceed 2 months from now."),
//   gender: z.string().min(1, "Kindly select your gender."),
//   education: z.string().min(1, "Kindly select your education level."),
//   dhaCertificate: z.string().min(1, "Kindly select one of the options below."),
//   careGiverCertificate: z
//     .string()
//     .min(1, "Kindly select one of the options below."),
//   experienceInUAE: z.array(z.string()).length(5),
//   visa: z.string().min(1, "Kindly select one of the options below."),
//   visaExpireDate: z
//     .date()
//     .refine((value) => value !== null && value !== undefined, {
//       message: "Visa expiration date is required.",
//     })
//     .refine((value) => !isNaN(value.getTime()), {
//       message: "Visa expiration date must be a valid date.",
//     })
//     .refine((value) => {
//       const threeMonthsAgo = subMonths(new Date(), 3);
//       return isAfter(value, threeMonthsAgo);
//     }, "Visa expired since 3 months or more!.")
//     .refine((value) => {
//       const today = new Date();
//       const tenYearsLater = addYears(today, 10);
//       return isBefore(value, tenYearsLater);
//     }, "Visa expiration date must be within 10 years from today."),
//   coverLetter: z
//     .string()
//     .max(5000, "Field must not exceed 5000 characters.")
//     .optional(),
//   imgUrl: z.string().min(1, "Kindly attach your CV."),
// });

// export const quoteSchema = z.object({
//   cstName: z
//     .string()
//     .min(1, "Kindly provide your name.")
//     .max(100, "Name must not exceed 100 characters.")
//     .refine(
//       (value) => /^[a-zA-Z\s]+$/.test(value),
//       "Name must not contain any numbers or special characters."
//     )
//     .refine((value) => value.trim().length > 0, "Kindly tell us your name."),
//   mobile: z
//     .string()
//     .min(1, "Kindly provide your mobile number.")
//     .max(14, "Mobile / landline number must not exceed 14 characters.")
//     .refine(
//       (value) =>
//         /^(?:\+971|00971|0)(?:2|3|4|6|7|8|9|50|52|54|55|56|58)[0-9]{7}$/.test(
//           value
//         ),
//       "Invalid mobile number."
//     ),
//   location: z
//     .string()
//     .min(1, "Kindly select your location.")
//     .max(14, "Location must not exceed 14 characters."),
//   email: z
//     .string()
//     .min(1, "Kindly provide us your email address.")
//     .max(100, "Email must not exceed 100 characters.")
//     .email("Invalid email address."),

//   numberOfHours: z
//     .string()
//     .min(1, "Kindly let us know how many hours you need.")
//     .refine(
//       (value) => !value.includes("."),
//       "The number of hours must not contain any decimal values."
//     )
//     .refine((value) => {
//       const hours = parseFloat(value);
//       return hours >= 1 && hours <= 24;
//     }, "The number of hours must be between 1 and 24."),
//   numberOfKids: z
//     .string()
//     .min(1, "Kindly let us know how many kids you have.")
//     .refine(
//       (value) => !value.includes("."),
//       "The number of kids must not contain any decimal values."
//     )
//     .refine((value) => {
//       const kids = parseFloat(value);
//       return kids > 0;
//     }, "The number of kids must be bigger than 0."),
//   ageOfKidsFrom: z
//     .string()
//     .min(1, "Kindly let us know the age of your youngest kid.")
//     .refine(
//       (value) => !value.includes("."),
//       "Please select the nearest whole number. Decimals are not allowed."
//     )
//     .refine((value) => {
//       const ageFrom = parseFloat(value);
//       fromAge = ageFrom;
//       return ageFrom > 0 && ageFrom <= 15;
//     }, "Kids age must be a positive number and less than or equal to 15."),
//   ageOfKidsTo: z
//     .string()
//     .min(1, "Kindly let us know the age of your oldest kid.")
//     .refine(
//       (value) => !value.includes("."),
//       "Please select the nearest whole number. Decimals are not allowed."
//     )
//     .refine((value) => {
//       const ageTo = parseFloat(value);
//       return ageTo > 0 && ageTo <= 15;
//     }, "Kids age must be a positive number and less than or equal to 15.")
//     .refine((value) => {
//       const ageTo = parseFloat(value);
//       return ageTo >= fromAge && ageTo <= 15;
//     }, "Please ensure the age range begins with the youngest child or remains equal."),
//   from: z.date().refine((value) => {
//     if (value !== null && value !== undefined) {
//       fromDate = value;
//       const maxDate = addYears(today, 1);
//       return isAfter(value, subDays(today, 1)) && isAfter(maxDate, value);
//     }
//   }, "The service can't start in the past or exceed a year from now."),
//   to: z
//     .date()
//     .refine((value) => {
//       if (value !== null && value !== undefined) {
//         return isEqual(value, fromDate) || isAfter(value, fromDate);
//       }
//     }, "The service can't end in the past or before the service start date.")
//     .refine((value) => {
//       const maxToDate = addYears(fromDate, 15);
//       return isAfter(maxToDate, value);
//     }, "The service duration can't exceed 15 years."),
//   extraInfo: z.string().max(5000, "maximum 5000 characters."),
// });
