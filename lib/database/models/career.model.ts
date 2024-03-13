import { Document, Schema, models, model, Types } from "mongoose";
import {
  isValid,
  addYears,
  isAfter,
  isBefore,
  subDays,
  subMonths,
  addMonths,
} from "date-fns";
import {
  isValidString,
  isValidMobile,
  isValidUrl,
  isInRange,
} from "@/lib/utils";
import { isEmail } from "validator";
import User from "./user.model";

export interface ICareer extends Document {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  applyingFor: string;
  workingAt?: string;
  previousSalary: string;
  expectedSalary: string;
  joinDate: Date;
  gender: string;
  education: string;
  dhaCertificate: string;
  careGiverCertificate: string;
  experienceInUAE: string[];
  visa: string;
  visaExpireDate: Date;
  coverLetter: string;
  imgUrl: string;
  imgSize: number;
  blocked: boolean;
  seen: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: Types.ObjectId | string | null;
}

const CareerSchema = new Schema<ICareer>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (value: string) {
          return isValidString(value, 100) && /^[a-zA-Z\s]+$/.test(value);
        },
        message: "Invalid full name",
      },
    },
    email: { type: String, required: true, trim: true, lowercase: true },
    mobile: { type: String, required: true, trim: true },
    applyingFor: { type: String, required: true, trim: true },
    workingAt: { type: String, trim: true },
    previousSalary: { type: String, trim: true },
    expectedSalary: { type: String, trim: true },
    joinDate: { type: Date, required: true },
    gender: { type: String, required: true },
    education: { type: String, required: true },
    dhaCertificate: { type: String, required: true },
    careGiverCertificate: { type: String, required: true },
    experienceInUAE: { type: [String], required: true, trim: true },
    visa: { type: String, required: true },
    visaExpireDate: { type: Date, required: true },
    coverLetter: { type: String, trim: true },
    imgUrl: { type: String, required: true },
    imgSize: { type: Number },
    blocked: { type: Boolean, default: false },
    seen: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", immutable: true },
  },
  { timestamps: true }
);

CareerSchema.pre<ICareer>("save", function (next) {
  const today = new Date();

  const fieldsToValidate: { key: string; value: any }[] = [
    { key: "fullName", value: this.fullName },
    { key: "email", value: this.email },
    { key: "mobile", value: this.mobile },
    { key: "workingAt", value: this.workingAt },
    { key: "applyingFor", value: this.applyingFor },
    { key: "joinDate", value: this.joinDate },
    { key: "previousSalary", value: this.previousSalary },
    { key: "expectedSalary", value: this.expectedSalary },
    { key: "gender", value: this.gender },
    { key: "education", value: this.education },
    { key: "dhaCertificate", value: this.dhaCertificate },
    { key: "careGiverCertificate", value: this.careGiverCertificate },
    { key: "visa", value: this.visa },
    { key: "visaExpireDate", value: this.visaExpireDate },
    { key: "experienceInUAE", value: this.experienceInUAE },
    { key: "coverLetter", value: this.coverLetter },
    { key: "imgUrl", value: this.imgUrl },
    { key: "imgSize", value: this.imgSize },
    { key: "createdBy", value: this.createdBy },
  ];

  let isError = false;

  fieldsToValidate.forEach(async ({ key, value }) => {
    if (isError) return;
    switch (key) {
      case "fullName":
        if (!isValidString(value, 100) || !/^[a-zA-Z\s]+$/.test(value))
          isError = true;
        break;

      case "email":
        if (!isValidString(value, 100) || !isEmail(value)) isError = true;
        break;

      case "mobile":
        if (!isValidString(value, 14) || !isValidMobile(value)) isError = true;
        break;

      case "workingAt":
        if (value && !isValidString(value, 150)) isError = true;
        break;

      case "applyingFor":
        if (!isValidString(value, 150)) isError = true;
        break;

      case "previousSalary":
        if (!isValidString(value, 25)) isError = true;
        break;

      case "expectedSalary":
        if (!isValidString(value, 25)) isError = true;
        break;

      case "joinDate":
        if (
          !value ||
          !isValid(new Date(value)) ||
          !isAfter(value, subDays(today, 1)) ||
          !isBefore(value, addMonths(today, 2))
        )
          isError = true;
        break;

      case "gender":
        if (
          !isValidString(value, 6) ||
          ["Female", "Male"].indexOf(value) === -1
        )
          isError = true;
        break;

      case "education":
        if (
          !isValidString(value, 8) ||
          ["Bachelor", "Diploma", "Other"].indexOf(value) === -1
        )
          isError = true;
        break;

      case "dhaCertificate":
        if (!isValidString(value, 3) || ["Yes", "No"].indexOf(value) === -1)
          isError = true;
        break;

      case "careGiverCertificate":
        if (!isValidString(value, 3) || ["Yes", "No"].indexOf(value) === -1)
          isError = true;
        break;

      case "experienceInUAE":
        if (!Array.isArray(value) || value.length !== 5) {
          isError = true;
        }
        break;

      case "visa":
        if (!isValidString(value, 3) || ["Yes", "No"].indexOf(value) === -1)
          isError = true;
        break;

      case "visaExpireDate":
        if (
          !value ||
          !isValid(new Date(value)) ||
          !isAfter(value, subMonths(today, 3)) ||
          !isBefore(value, addYears(today, 10))
        )
          isError = true;
        break;

      case "coverLetter":
        if (value && !isValidString(value, 5000)) isError = true;
        break;

      case "imgUrl":
        if (!value || typeof value !== "string" || !isValidUrl(value))
          isError = true;
        break;

      case "imgSize":
        if (
          !value ||
          typeof value !== "number" ||
          !isInRange(value, 1, 1024000)
        )
          isError = true;
        break;

      case "createdBy":
        try {
          const user = await User.findById(value);
          if (!user) this.createdBy = null;
        } catch (error) {
          console.error("Error finding user:", error);
          isError = true;
        }
        break;
    }
  });

  if (isError) {
    next(new Error("Invalid Form."));
  } else {
    next();
  }
});

const Career = models.Career || model<ICareer>("Career", CareerSchema);

export default Career;
