import {
  Document,
  Schema,
  models,
  model,
  Types,
  CallbackError,
} from "mongoose";
import { addYears, subDays } from "date-fns";
import { today, quoteLocations } from "@/constants";
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
            return isInArray(value, quoteLocations);
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

// QuoteSchema.pre<IQuote>("save", function (next) {
//   const today = new Date();

//   const fieldsToValidate: { key: string; value: any }[] = [
//     { key: "cstName", value: this.cstName },
//     { key: "location", value: this.location },
//     { key: "mobile", value: this.mobile },
//     { key: "email", value: this.email },
//     { key: "numberOfHours", value: this.numberOfHours },
//     { key: "numberOfKids", value: this.numberOfKids },
//     { key: "ageOfKidsFrom", value: this.ageOfKidsFrom },
//     { key: "ageOfKidsTo", value: this.ageOfKidsTo },
//     { key: "from", value: this.from },
//     { key: "to", value: this.to },
//     { key: "extraInfo", value: this.extraInfo },
//     { key: "extraInfo", value: this.extraInfo },
//   ];

//   let isError = false;

//   fieldsToValidate.forEach(async ({ key, value }) => {
//     if (isError) return;
//     switch (key) {
//       case "cstName":
//         if (!isValidString(value, 100) || !/^[a-zA-Z\s]+$/.test(value))
//           isError = true;
//         break;

//       case "location":
//         if (
//           !isValidString(value, 14) ||
//           [
//             "Abu Dhabi",
//             "Dubai",
//             "Sharjah",
//             "Ajman",
//             "Umm Al Quwain",
//             "Ras Al Khaimah",
//             "Fujairah",
//           ].indexOf(value) === -1
//         )
//           isError = true;
//         break;

//       case "mobile":
//         if (
//           !isValidString(value, 14) ||
//           !/^(?:\+971|00971|0)(?:2|3|4|6|7|8|9|50|52|54|55|56|58)[0-9]{7}$/.test(
//             value
//           )
//         )
//           isError = true;
//         break;

//       case "email":
//         if (!isValidString(value, 100) || !isEmail(value)) isError = true;
//         break;

//       case "numberOfHours":
//         if (
//           !isValidString(value, 2) ||
//           !isDecimal(value) ||
//           !isInRange(parseInt(value), 1, 24)
//         )
//           isError = true;
//         break;

//       case "numberOfKids":
//         if (
//           !isValidString(value, 4) ||
//           !isDecimal(value) ||
//           !isInRange(parseInt(value), 1, 1000)
//         )
//           isError = true;
//         break;

//       case "ageOfKidsFrom":
//         if (
//           !isValidString(value, 2) ||
//           !isDecimal(value) ||
//           !isInRange(parseInt(value), 1, 15)
//         )
//           isError = true;
//         break;

//       case "ageOfKidsTo":
//         if (
//           !isValidString(value, 2) ||
//           !isDecimal(value) ||
//           !isInRange(parseInt(value), 1, 15) ||
//           parseInt(value) < parseInt(this.ageOfKidsFrom)
//         )
//           isError = true;
//         break;

//       case "from":
//         if (
//           !value ||
//           !isValid(new Date(value)) ||
//           !isAfter(value, subDays(today, 1)) ||
//           !isBefore(value, addYears(today, 1))
//         )
//           isError = true;
//         break;

//       case "to":
//         if (
//           !value ||
//           !isValid(new Date(value)) ||
//           !isBefore(value, addYears(value, 15)) ||
//           isBefore(value, this.from)
//         )
//           isError = true;
//         break;

//       case "extraInfo":
//         if (value && !isValidString(value, 5000)) isError = true;
//         break;

//       case "createdBy":
//         try {
//           const user = await User.findById(value);
//           if (!user) this.createdBy = null;
//         } catch (error) {
//           console.error("Error finding user:", error);
//           isError = true;
//         }
//         break;
//     }
//   });

//   if (isError) {
//     next(new Error("Invalid Form."));
//   } else {
//     next();
//   }
// });
