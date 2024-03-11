import { Document, Schema, models, model, Types } from "mongoose";
import { isValid, addYears, isAfter, isBefore, subDays } from "date-fns";
import { isValidString, isInRange } from "@/lib/utils";
import { isEmail, isDecimal } from "validator";
import User, { IUser } from "./user.model";

export interface IQuote extends Document {
  _id: string;
  cstName: string;
  mobile: string;
  location: string;
  email: string;
  numberOfHours: string;
  numberOfKids: string;
  ageOfKidsFrom: string;
  ageOfKidsTo: string;
  from: Date;
  to: Date;
  extraInfo?: string;
  createdAt: string;
  updatedAt: string;
  blocked: boolean;
  seen: boolean;
  emailService: { id: string | null; error: string | null };
  createdBy: Types.ObjectId | string | Partial<IUser> | null;
}

const QuoteSchema = new Schema(
  {
    cstName: { type: String, trim: true },
    mobile: { type: String, trim: true },
    location: { type: String, trim: true },
    email: { type: String, trim: true },
    numberOfHours: { type: String, trim: true },
    numberOfKids: { type: String, trim: true },
    ageOfKidsFrom: { type: String, trim: true },
    ageOfKidsTo: { type: String, trim: true },
    from: { type: Date },
    to: { type: Date },
    extraInfo: { type: String, trim: true },
    blocked: { type: Boolean, default: false },
    seen: { type: Boolean, default: false },
    emailService: {
      id: { type: String, default: null },
      error: { type: String, default: null },
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

QuoteSchema.pre<IQuote>("save", function (next) {
  const today = new Date();

  const fieldsToValidate: { key: string; value: any }[] = [
    { key: "cstName", value: this.cstName },
    { key: "location", value: this.location },
    { key: "mobile", value: this.mobile },
    { key: "email", value: this.email },
    { key: "numberOfHours", value: this.numberOfHours },
    { key: "numberOfKids", value: this.numberOfKids },
    { key: "ageOfKidsFrom", value: this.ageOfKidsFrom },
    { key: "ageOfKidsTo", value: this.ageOfKidsTo },
    { key: "from", value: this.from },
    { key: "to", value: this.to },
    { key: "extraInfo", value: this.extraInfo },
    { key: "extraInfo", value: this.extraInfo },
  ];

  let isError = false;

  fieldsToValidate.forEach(async ({ key, value }) => {
    if (isError) return;
    switch (key) {
      case "cstName":
        if (!isValidString(value, 100) || !/^[a-zA-Z\s]+$/.test(value))
          isError = true;
        break;

      case "location":
        if (
          !isValidString(value, 14) ||
          [
            "Abu Dhabi",
            "Dubai",
            "Sharjah",
            "Ajman",
            "Umm Al Quwain",
            "Ras Al Khaimah",
            "Fujairah",
          ].indexOf(value) === -1
        )
          isError = true;
        break;

      case "mobile":
        if (
          !isValidString(value, 14) ||
          !/^(?:\+971|00971|0)(?:2|3|4|6|7|8|9|50|52|54|55|56|58)[0-9]{7}$/.test(
            value
          )
        )
          isError = true;
        break;

      case "email":
        if (!isValidString(value, 100) || !isEmail(value)) isError = true;
        break;

      case "numberOfHours":
        if (
          !isValidString(value, 2) ||
          !isDecimal(value) ||
          !isInRange(parseInt(value), 1, 24)
        )
          isError = true;
        break;

      case "numberOfKids":
        if (
          !isValidString(value, 4) ||
          !isDecimal(value) ||
          !isInRange(parseInt(value), 1, 1000)
        )
          isError = true;
        break;

      case "ageOfKidsFrom":
        if (
          !isValidString(value, 2) ||
          !isDecimal(value) ||
          !isInRange(parseInt(value), 1, 15)
        )
          isError = true;
        break;

      case "ageOfKidsTo":
        if (
          !isValidString(value, 2) ||
          !isDecimal(value) ||
          !isInRange(parseInt(value), 1, 15) ||
          parseInt(value) < parseInt(this.ageOfKidsFrom)
        )
          isError = true;
        break;

      case "from":
        if (
          !value ||
          !isValid(new Date(value)) ||
          !isAfter(value, subDays(today, 1)) ||
          !isBefore(value, addYears(today, 1))
        )
          isError = true;
        break;

      case "to":
        if (
          !value ||
          !isValid(new Date(value)) ||
          !isBefore(value, addYears(value, 15)) ||
          isBefore(value, this.from)
        )
          isError = true;
        break;

      case "extraInfo":
        if (value && !isValidString(value, 5000)) isError = true;
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

const Quote = models.Quote || model<IQuote>("Quote", QuoteSchema);

export default Quote;

// delete require.cache[require.resolve("../database/models/quote.model")];
// const Quote = require("../database/models/quote.model");
