import { minMaxValues } from "@/constants";
import { toCap } from "@/lib/utils";

const setProvideErr = (required: string): string =>
  `Kindly provide your ${toCap(required)}.`;

const setSpecialCharsErr = (required: string): string =>
  `${toCap(required)} must not contain any special characters or numbers.`;

const setEmptyErr = (required: string): string =>
  `${toCap(required)} can't be a white/empty spaces. ${setProvideErr(
    required
  )}`;

const setExceedErr = (required: string, value: number): string =>
  `${toCap(required)} must not exceed ${value} characters.`;

const setInvalidErr = (required: string): string =>
  `Invalid ${toCap(required)} provided.`;

const setRangeErr = (
  required: string,
  min: number,
  max: number,
  unit?: string
): string =>
  `${toCap(required)} must be between ${min} and ${max} ${unit ?? ""}.`;

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
  reviews,
  comments,
  quotation,
  contacts,
  aboutUs,
  career,
} = minMaxValues;

const { name, mobile, location, email, hours, kids, age, date, extraInfo } =
  quotation;

export const logoErrs = {
  length: { min: logoImg.minLength },
  errs: {
    min: setProvideErr("logo image"),
    invalid: setInvalidErr("logo image url "),
  },
};

export const galleryErrs = {
  length: { min: galleryImg.minLength },
  errs: {
    min: setProvideErr("gallery image"),
    invalid: setInvalidErr("gallery image url"),
  },
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
    errs: {
      min: setProvideErr("service image"),
      invalid: setInvalidErr("service image url"),
    },
  },
  serviceContent: {
    length: { min: services.content.minLength },
    errs: { min: setProvideErr("service content") },
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

export const recordErrs = {
  imgUrl: {
    length: { min: records.img.minLength },
    errs: {
      min: setProvideErr("record svg icon"),
      invalid: setInvalidErr("record icon url"),
    },
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

export const reviewErrs = {
  review: {
    length: { min: reviews.review.minLength, max: reviews.review.maxLength },
    errs: {
      min: setProvideErr("review"),
      max: setExceedErr("reviews", reviews.review.maxLength),
      empty: setEmptyErr("review"),
    },
  },
  rating: {
    length: {
      min: reviews.rating.minLength,
      max: reviews.rating.maxLength,
    },
    values: {
      min: reviews.rating.minValue,
      max: reviews.rating.maxValue,
    },
    errs: {
      max: setExceedErr("rating", reviews.rating.maxLength),
      range: setRangeErr(
        "rating",
        reviews.rating.minValue,
        reviews.rating.maxValue,
        "stars"
      ),
    },
  },
};

export const commentsErrs = {
  comment: {
    length: {
      min: comments.comment.minLength,
      max: comments.comment.maxLength,
    },
    errs: {
      min: setProvideErr("comment"),
      max: setExceedErr("comments", comments.comment.maxLength),
      empty: setEmptyErr("comment"),
    },
  },
};

export const quoteErrs = {
  cstName: {
    length: { min: name.minLength, max: name.maxLength },
    errs: {
      min: setProvideErr("name"),
      max: setExceedErr("name", name.maxLength),
      specialChars: setSpecialCharsErr("name"),
      empty: setEmptyErr("name"),
    },
  },
  mobile: {
    length: { min: mobile.minLength, max: mobile.maxLength },
    errs: {
      min: setProvideErr("mobile / landline number"),
      max: setExceedErr("mobile / landline number", mobile.maxLength),
      invalid: setInvalidErr("mobile number"),
    },
  },
  location: {
    length: { min: location.minLength, max: location.maxLength },
    errs: {
      min: setProvideErr("location"),
      max: setExceedErr("location", location.maxLength),
      invalid: setInvalidErr("location"),
    },
  },
  email: {
    length: { min: email.minLength, max: email.maxLength },
    errs: {
      min: setProvideErr("email address"),
      max: setExceedErr("email address", email.maxLength),
      invalid: setInvalidErr("email address"),
    },
  },
  hours: {
    length: { min: hours.minLength, max: hours.maxLength },
    values: { min: hours.minValue, max: hours.maxValue },
    errs: {
      min: setProvideErr("number of hours"),
      max: setExceedErr("number of hours", hours.maxLength),
      invalid: setDecimalErr("number of hours"),
      range: setRangeErr(
        "number of hours",
        hours.minValue,
        hours.maxValue,
        "hours"
      ),
    },
  },
  kids: {
    length: { min: kids.minLength, max: kids.maxLength },
    values: { min: kids.minValue, max: kids.maxValue },
    errs: {
      min: setProvideErr("number of kids"),
      max: setExceedErr("number of kids", kids.maxLength),
      invalid: setDecimalErr("number of kids"),
      range: setRangeErr("number of kids", kids.minValue, kids.maxValue),
    },
  },
  age: {
    length: { min: age.minLength, max: age.maxLength },
    values: { min: age.minValue, max: age.maxValue },
    errs: {
      from: { min: setTellUsErr("the age of your kids / youngest kid") },
      to: { min: setTellUsErr("the age of your kids / oldest kid") },
      max: setExceedErr("the age of your kids", age.maxLength),
      range: setRangeErr("age of kids", age.minValue, age.maxValue, "years"),
      invalid: setDecimalErr("age of kids"),
      exceed:
        "The age of your kids / youngest kid can't exceed the oldest kid.",
    },
  },
  serviceDates: {
    length: { min: date.minLength, max: date.maxLength },
    values: { max: date.maxValue },
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
    length: { max: extraInfo.maxLength },
    errs: { max: setExceedErr("extra info", extraInfo.maxLength) },
  },
};

export const contactErrs = {
  imgUrl: {
    length: { min: contacts.imgUrl.minLength },
    errs: {
      min: setProvideErr("contact svg icon"),
      invalid: setInvalidErr("contact icon url"),
    },
  },
  content: {
    length: { min: contacts.content.minLength },
    errs: { min: setProvideErr("contact content") },
  },
};

export const aboutUsErrs = {
  title: {
    length: { min: aboutUs.title.minLength },
    errs: { min: setProvideErr("about us article title") },
  },
  content: {
    length: { min: aboutUs.content.minLength },
    errs: { min: setProvideErr("about us article content") },
  },
  imgUrl: {
    length: { min: aboutUs.imgUrl.minLength },
    errs: {
      min: setProvideErr("about us article image"),
      invalid: setInvalidErr("about us image url"),
    },
  },
};

const {
  fullName,
  workingAt,
  applyingFor,
  joinDate,
  salary,
  gender,
  education,
  dha,
  cgc,
  visa,
  visExpiryDate,
  coverLetter,
  imgUrl: resumePdf,
} = career;

export const careerErrs = {
  fullName: {
    length: { min: fullName.minLength, max: fullName.maxLength },
    errs: {
      min: setProvideErr("full name"),
      max: setExceedErr("full name", fullName.maxLength),
      specialChars: setSpecialCharsErr("full name"),
      empty: setEmptyErr("full name"),
    },
  },
  email: {
    length: { min: email.minLength, max: email.maxLength },
    errs: {
      min: setProvideErr("email address"),
      max: setExceedErr("email address", email.maxLength),
      invalid: setInvalidErr("email address"),
    },
  },
  mobile: {
    length: { min: mobile.minLength, max: mobile.maxLength },
    errs: {
      min: setProvideErr("mobile / landline number"),
      max: setExceedErr("mobile / landline number", mobile.maxLength),
      invalid: setInvalidErr("mobile number"),
    },
  },
  workingAt: {
    length: { max: workingAt.maxLength },
    errs: {
      max: setExceedErr("current job description", workingAt.maxLength),
    },
  },
  applyingFor: {
    length: { min: applyingFor.minLength, max: applyingFor.maxLength },
    errs: {
      min: setProvideErr("future job description"),
      max: setExceedErr("current job description", applyingFor.maxLength),
    },
  },
  joinDate: {
    length: { min: joinDate.minLength, max: joinDate.maxLength },
    values: { max: joinDate.maxValue },
    errs: {
      min: setTellUsErr("the date you will join us"),
      invalid: `The joining date can't start in the past or exceed ${joinDate.maxValue} months from now.`,
      max: setExceedErr("joining date", joinDate.maxLength),
    },
  },
  previousSalary: {
    length: { max: salary.maxLength },
    errs: {
      max: setExceedErr("previous salary", salary.maxLength),
    },
  },
  expectedSalary: {
    length: { max: salary.maxLength },
    errs: {
      max: setExceedErr("expected salary", salary.maxLength),
    },
  },
  gender: {
    length: { min: gender.minLength, max: gender.maxLength },
    errs: {
      min: setProvideErr("gender"),
      max: setExceedErr("gender", gender.maxLength),
      invalid: setInvalidErr("gender option"),
    },
  },
  education: {
    length: { min: education.minLength, max: education.maxLength },
    errs: {
      min: setProvideErr("education"),
      max: setExceedErr("education", education.maxLength),
      invalid: setInvalidErr("education option"),
    },
  },
  dha: {
    length: { min: dha.minLength, max: dha.maxLength },
    errs: {
      min: setProvideErr("dubai health authority certificate"),
      max: setExceedErr("dubai health authority certificate", dha.maxLength),
      invalid: setInvalidErr("dha option"),
    },
  },
  cgc: {
    length: { min: cgc.minLength, max: cgc.maxLength },
    errs: {
      min: setProvideErr("care giver certificate"),
      max: setExceedErr("care giver certificate", cgc.maxLength),
      invalid: setInvalidErr("cgc option"),
    },
  },
  visa: {
    length: { min: visa.minLength, max: visa.maxLength },
    errs: {
      min: setProvideErr("visa"),
      max: setExceedErr("visa", visa.maxLength),
      invalid: setInvalidErr("visa option"),
    },
  },
  visaExpiryDate: {
    length: { min: visExpiryDate.minLength, max: visExpiryDate.maxLength },
    values: { max: visExpiryDate.maxValue },
    errs: {
      min: setTellUsErr("the date you will join us"),
      invalid: {
        threeMonths: "Visa expired since 3 months or more!",
        tenYears: `Visa expiration date must be within ${visExpiryDate.maxValue} years from now.`,
      },
      max: setExceedErr("visa expiry date", visExpiryDate.maxLength),
    },
  },
  coverLetter: {
    length: { max: coverLetter.maxLength },
    errs: { max: setExceedErr("cover letter", coverLetter.maxLength) },
  },
  imgUrl: {
    length: { min: resumePdf.minLength },
    errs: {
      min: setProvideErr("resume"),
      invalid: setInvalidErr("resume url"),
    },
  },
};
