import { Document, Schema, models, model, Types } from "mongoose";
import {
  addYears,
  isAfter,
  isBefore,
  subDays,
  subMonths,
  addMonths,
} from "date-fns";
import {
  isValidName,
  isValidMobile,
  isValidUrl,
  isEmpty,
  isWithinDateRange,
  isInArray,
} from "@/lib/utils";
import { careerErrs } from "@/constants/errors";
import { today, gendersArr, educationsArr, yesNoArr } from "@/constants";
import { isEmail } from "validator";

export interface ICareer extends Document {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  applyingFor: string;
  workingAt: string;
  previousSalary?: string;
  expectedSalary?: string;
  joinDate: Date;
  gender: string;
  education: string;
  dhaCertificate: string;
  careGiverCertificate: string;
  experienceInUAE: string[];
  visa: string;
  visaExpireDate: Date;
  coverLetter?: string;
  imgUrl: string;
  imgSize: number;
  blocked: boolean;
  seen: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: Types.ObjectId | string | null;
}

const {
  fullName,
  email,
  mobile,
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
  imgUrl,
} = careerErrs;

const CareerSchema = new Schema<ICareer>(
  {
    fullName: {
      type: String,
      trim: true,
      required: [true, fullName.errs.min],
      maxlength: [fullName.length.max, fullName.errs.max],
      validate: [
        { validator: isValidName, message: fullName.errs.specialChars },
        { validator: isEmpty, message: fullName.errs.empty },
      ],
    },
    email: {
      type: String,
      trim: true,
      required: [true, email.errs.min],
      maxlength: [email.length.max, email.errs.max],
      lowercase: true,
      validate: [
        {
          validator: function (value: string) {
            return isEmail(value);
          },
          message: email.errs.invalid,
        },
      ],
    },
    mobile: {
      type: String,
      trim: true,
      required: [true, mobile.errs.min],
      maxlength: [mobile.length.max, mobile.errs.max],
      validate: [{ validator: isValidMobile, message: mobile.errs.invalid }],
    },
    workingAt: {
      type: String,
      trim: true,
      maxlength: [workingAt.length.max, workingAt.errs.max],
    },
    applyingFor: {
      type: String,
      trim: true,
      required: [true, applyingFor.errs.min],
      maxlength: [applyingFor.length.max, applyingFor.errs.max],
    },
    joinDate: {
      type: Date,
      required: [true, joinDate.errs.min],
      maxlength: [joinDate.length.max, joinDate.errs.max],
      validate: [
        {
          validator: function (value: Date) {
            return isWithinDateRange(
              value,
              subDays(today, 1),
              addMonths(today, 2)
            );
          },
          message: joinDate.errs.invalid,
        },
      ],
    },
    previousSalary: {
      type: String,
      trim: true,
      maxlength: [previousSalary.length.max, previousSalary.errs.max],
    },
    expectedSalary: {
      type: String,
      trim: true,
      maxlength: [expectedSalary.length.max, expectedSalary.errs.max],
    },
    gender: {
      type: String,
      required: [true, gender.errs.min],
      maxlength: [gender.length.max, gender.errs.max],
      validate: [
        {
          validator: function (value: string) {
            return isInArray(value, gendersArr);
          },
          message: gender.errs.invalid,
        },
      ],
    },
    education: {
      type: String,
      required: [true, education.errs.min],
      maxlength: [education.length.max, education.errs.max],
      validate: [
        {
          validator: function (value: string) {
            return isInArray(value, educationsArr);
          },
          message: education.errs.invalid,
        },
      ],
    },
    dhaCertificate: {
      type: String,
      required: [true, dha.errs.min],
      maxlength: [dha.length.max, dha.errs.max],
      validate: [
        {
          validator: function (value: string) {
            return isInArray(value, yesNoArr);
          },
          message: dha.errs.invalid,
        },
      ],
    },
    careGiverCertificate: {
      type: String,
      required: [true, cgc.errs.min],
      maxlength: [cgc.length.max, cgc.errs.max],
      validate: [
        {
          validator: function (value: string) {
            return isInArray(value, yesNoArr);
          },
          message: cgc.errs.invalid,
        },
      ],
    },
    experienceInUAE: {
      type: [
        {
          type: String,
          maxlength: [
            2000,
            "Each input in experience in UAE array must not exceed 2000 characters.",
          ],
        },
      ],
    },
    visa: {
      type: String,
      required: [true, visa.errs.min],
      maxlength: [visa.length.max, visa.errs.max],
      validate: [
        {
          validator: function (value: string) {
            return isInArray(value, yesNoArr);
          },
          message: visa.errs.invalid,
        },
      ],
    },
    visaExpireDate: {
      type: Date,
      required: [true, visaExpiryDate.errs.min],
      maxlength: [visaExpiryDate.length.max, visaExpiryDate.errs.max],
      validate: [
        {
          validator: function (value: Date) {
            return isAfter(value, subMonths(today, 3));
          },
          message: visaExpiryDate.errs.invalid.threeMonths,
        },
        {
          validator: function (value: Date) {
            return isBefore(value, addYears(today, 10));
          },
          message: visaExpiryDate.errs.invalid.tenYears,
        },
      ],
    },
    coverLetter: {
      type: String,
      trim: true,
      maxlength: [coverLetter.length.max, coverLetter.errs.max],
    },
    imgUrl: {
      type: String,
      trim: true,
      required: [true, imgUrl.errs.min],
      validate: { validator: isValidUrl, message: imgUrl.errs.invalid },
    },
    imgSize: { type: Number, required: true },
    blocked: { type: Boolean, default: false },
    seen: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", immutable: true },
  },
  { timestamps: true }
);

const Career = models.Career || model<ICareer>("Career", CareerSchema);

export default Career;
