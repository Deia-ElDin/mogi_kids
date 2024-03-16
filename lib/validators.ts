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
  imgUrl: z
    .string()
    .min(resumePdf.length.min, resumePdf.errs.min)
    .refine((value) => !isValidUrl(value), resumePdf.errs.invalid),
});
