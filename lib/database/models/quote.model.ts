import {
  Document,
  Schema,
  models,
  model,
  Types,
  CallbackError,
} from "mongoose";
import { addYears, subDays } from "date-fns";
import { today, quoteLocationsArr } from "@/constants";
import { quoteErrs } from "@/constants/errors";
import {
  isValidName,
  isEmpty,
  isValidMobile,
  isInRange,
  isInArray,
  isWithinDateRange,
} from "@/lib/utils";
import { isEmail, isDecimal } from "validator";
import { IUser } from "./user.model";

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
  createdBy?: Types.ObjectId | string | Partial<IUser> | null;
}

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

const QuoteSchema = new Schema(
  {
    cstName: {
      type: String,
      trim: true,
      required: [true, cstName.errs.min],
      maxlength: [cstName.length.max, cstName.errs.max],
      validate: [
        { validator: isValidName, message: cstName.errs.specialChars },
        { validator: isEmpty, message: cstName.errs.empty },
      ],
    },
    mobile: {
      type: String,
      trim: true,
      required: [true, mobile.errs.min],
      maxlength: [mobile.length.max, mobile.errs.max],
      validate: [{ validator: isValidMobile, message: mobile.errs.invalid }],
    },
    location: {
      type: String,
      trim: true,
      required: [true, location.errs.min],
      maxlength: [location.length.max, location.errs.max],
      validate: [
        {
          validator: function (value: string) {
            return isInArray(value, quoteLocationsArr);
          },
          message: location.errs.invalid,
        },
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
    numberOfHours: {
      type: String,
      trim: true,
      required: [true, hours.errs.min],
      maxlength: [hours.length.max, hours.errs.max],
      validate: [
        {
          validator: function (value: string) {
            return isDecimal(value);
          },
          message: hours.errs.invalid,
        },
        {
          validator: function (value: string) {
            return isInRange(
              parseInt(value),
              hours.values.min,
              hours.values.max
            );
          },
          message: hours.errs.range,
        },
      ],
    },
    numberOfKids: {
      type: String,
      trim: true,
      required: [true, kids.errs.min],
      maxlength: [kids.length.max, kids.errs.max],
      validate: [
        {
          validator: function (value: string) {
            return isDecimal(value);
          },
          message: kids.errs.invalid,
        },
        {
          validator: function (value: string) {
            return isInRange(parseInt(value), kids.values.min, kids.values.max);
          },
          message: kids.errs.range,
        },
      ],
    },
    ageOfKidsFrom: {
      type: String,
      trim: true,
      required: [true, age.errs.from.min],
      maxlength: [age.length.max, age.errs.max],
      validate: [
        {
          validator: function (value: string) {
            return isDecimal(value);
          },
          message: age.errs.invalid,
        },
        {
          validator: function (value: string) {
            return isInRange(parseInt(value), age.values.min, age.values.max);
          },
          message: age.errs.range,
        },
      ],
    },
    ageOfKidsTo: {
      type: String,
      trim: true,
      required: [true, age.errs.to.min],
      maxlength: [age.length.max, age.errs.max],
      validate: [
        {
          validator: function (value: string) {
            return isDecimal(value);
          },
          message: age.errs.invalid,
        },
        {
          validator: function (value: string) {
            return isInRange(parseInt(value), age.values.min, age.values.max);
          },
          message: age.errs.range,
        },
      ],
    },
    from: {
      type: Date,
      required: [true, serviceDates.errs.from.min],
      maxlength: [serviceDates.length.max, serviceDates.errs.max],
      validate: [
        {
          validator: function (value: Date) {
            return isWithinDateRange(
              value,
              subDays(today, 1),
              addYears(today, 1)
            );
          },
          message: serviceDates.errs.from.invalid,
        },
      ],
    },
    to: {
      type: Date,
      required: [true, serviceDates.errs.to.min],
      maxlength: [serviceDates.length.max, serviceDates.errs.max],
      validate: [
        {
          validator: function (value: Date) {
            return isWithinDateRange(
              value,
              subDays(today, 1),
              addYears(today, serviceDates.values.max)
            );
          },
          message: serviceDates.errs.to.invalid,
        },
      ],
    },
    extraInfo: {
      type: String,
      trim: true,
      maxlength: [extraInfo.length.max, extraInfo.errs.max],
    },
    blocked: { type: Boolean, default: false },
    seen: { type: Boolean, default: false },
    emailService: {
      id: { type: String, default: null },
      error: { type: String, default: null },
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", immutable: true },
  },
  { timestamps: true }
);

QuoteSchema.pre<IQuote>("save", async function (next) {
  try {
    await this.validate();

    if (parseInt(this.ageOfKidsTo) < parseInt(this.ageOfKidsFrom)) {
      const error = new Error(age.errs.exceed);
      next(error);
      return;
    }

    if (this.to < this.from) {
      const error = new Error(serviceDates.errs.to.invalid);
      next(error);
      return;
    }

    next();
  } catch (error) {
    next(error as unknown as CallbackError);
  }
});

const Quote = models.Quote || model<IQuote>("Quote", QuoteSchema);

export default Quote;

// delete require.cache[require.resolve("../database/models/quote.model")];
// const Quote = require("../database/models/quote.model");
