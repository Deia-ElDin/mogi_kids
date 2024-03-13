import { minMaxValues } from "@/constants";
import { toCap } from "@/lib/utils";

const setProvideErr = (required: string): string =>
  `Kindly provide your ${toCap(required)}.`;

const setSpecialCharsErr = (required: string): string =>
  `${toCap(required)} must not contain any special characters or numbers.`;

const setEmptyErr = (required: string): string =>
  `${toCap(required)} can't be an empty spaces. ${setProvideErr(required)}`;

const setExceedErr = (required: string, value: number): string =>
  `${toCap(required)} must not exceed ${value} characters.`;

const setInvalidErr = (required: string): string =>
  `Invalid ${toCap(required)} provided.`;

const setRangeErr = (required: string, min: number, max: number): string =>
  `${toCap(required)} must be between ${min} and ${max}.`;

const setDecimalErr = (required: string): string =>
  `${toCap(required)} must not contain any decimal values.`;

const setTellUsErr = (required: string): string =>
  `Kindly tell us ${toCap(required)}.`;

export const setITError = (err: string): string =>
  `Connect with the IT department, Page Naming Error. ${toCap(err)}`;

const {
  logoImg,
  galleryImg,
  webPage,
  services,
  questions,
  records,
  quotation,
} = minMaxValues;

const { name, mobile, location, email, hours, kids, age, date, extraInfo } =
  quotation;

export const iTErr = {};

export const logoErrs = {
  length: { min: logoImg.minLength },
  err: setProvideErr("logo image"),
};

export const galleryErrs = {
  length: { min: galleryImg.minLength },
  err: setProvideErr("gallery image"),
};

export const webPageErrs = {
  length: { min: webPage.title.minLength },
  err: setProvideErr("web page title"),
};

export const serviceErrs = {
  serviceName: {
    length: { min: services.name.minLength },
    errs: { min: setProvideErr("service name") },
  },
  imgUrl: {
    length: { min: services.img.minLength },
    errs: { min: setProvideErr("service image") },
  },
  serviceContent: {
    length: { min: services.content.minLength },
    errs: { min: setProvideErr("service content") },
  },
};

export const recordErrs = {
  imgUrl: {
    length: { min: records.img.minLength },
    errs: { min: setProvideErr("record svg icon") },
  },
  value: {
    length: { min: records.value.minLength },
    errs: { min: setProvideErr("record value") },
  },
  label: {
    length: { min: records.label.minLength },
    errs: { min: setProvideErr("record name") },
  },
};

export const questionErrs = {
  question: {
    length: { min: questions.question.minLength },
    errs: { min: setProvideErr("question") },
  },
  answer: {
    length: { min: questions.answer.minLength },
    errs: { min: setProvideErr("answer") },
  },
};

export const quoteErrs = {
  cstName: {
    length: {
      min: name.minLength,
      max: name.maxLength,
    },
    errs: {
      min: setProvideErr("name"),
      max: setExceedErr("name", name.maxLength),
      specialChars: setSpecialCharsErr("name"),
      empty: setEmptyErr("name"),
    },
  },
  mobile: {
    length: {
      min: mobile.minLength,
      max: mobile.maxLength,
    },
    errs: {
      min: setProvideErr("mobile / landline number"),
      max: setExceedErr("mobile / landline number", mobile.maxLength),
      invalid: setInvalidErr("mobile number"),
    },
  },
  location: {
    length: {
      min: location.minLength,
      max: location.maxLength,
    },
    errs: {
      min: setProvideErr("location"),
      max: setExceedErr("location", location.maxLength),
      invalid: setInvalidErr("location"),
    },
  },
  email: {
    length: {
      min: email.minLength,
      max: email.maxLength,
    },
    errs: {
      min: setProvideErr("email address"),
      max: setExceedErr("email address", email.maxLength),
      invalid: setInvalidErr("email address"),
    },
  },
  hours: {
    length: {
      min: hours.minLength,
      max: hours.maxLength,
    },
    values: {
      min: hours.minValue,
      max: hours.maxValue,
    },
    errs: {
      min: setProvideErr("number of hours"),
      max: setExceedErr("number of hours", hours.maxLength),
      invalid: setDecimalErr("number of hours"),
      range: setRangeErr("number of hours", hours.minValue, hours.maxValue),
    },
  },
  kids: {
    length: {
      min: kids.minLength,
      max: kids.maxLength,
    },
    values: {
      min: kids.minValue,
      max: kids.maxValue,
    },
    errs: {
      min: setProvideErr("number of kids"),
      max: setExceedErr("number of kids", kids.maxLength),
      invalid: setDecimalErr("number of kids"),
      range: setRangeErr("number of kids", kids.minValue, kids.maxValue),
    },
  },
  age: {
    length: {
      min: age.minLength,
      max: age.maxLength,
    },
    values: {
      min: age.minValue,
      max: age.maxValue,
    },
    errs: {
      from: { min: setTellUsErr("the age of your kids / youngest kid") },
      to: { min: setTellUsErr("the age of your kids / oldest kid") },
      max: setExceedErr("the age of your kids", age.maxLength),
      range: setRangeErr("age of kids", age.minValue, age.maxValue),
      invalid: setDecimalErr("age of kids"),
      exceed:
        "The age of your kids / youngest kid can't exceed the oldest kid.",
    },
  },
  serviceDates: {
    length: {
      min: date.minLength,
      max: date.maxLength,
    },
    values: {
      max: date.maxValue,
    },
    errs: {
      from: {
        min: setTellUsErr("the starting date of the service"),
        invalid:
          "The service can't start in the past or exceed a year from now.",
      },
      to: {
        min: setTellUsErr("the ending date of the service"),
        invalid:
          "The service can't end in the past or before the service starting date.",
        duration: `The service duration can't exceed ${date.maxValue} years.`,
      },
      max: setExceedErr("service dates", date.maxLength),
    },
  },
  extraInfo: {
    length: {
      max: extraInfo.maxLength,
    },
    errs: {
      max: setExceedErr("extra info", extraInfo.maxLength),
    },
  },
};
