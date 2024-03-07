import { Document, Schema, models, model, Types } from "mongoose";
import { IUser } from "./user.model";

export interface IQuote extends Document {
  _id: string;
  cstName: string;
  mobile: string;
  location?: string;
  email: string;
  from: Date;
  to: Date;
  numberOfHours: string;
  numberOfKids: string;
  ageOfKidsFrom: string;
  ageOfKidsTo: string;
  extraInfo?: string;
  emailService: { id: string | null; error: string | null };
  createdAt: string;
  updatedAt: string;
  blocked: boolean;
  seen: boolean;
  createdBy: Types.ObjectId | string | Partial<IUser>;
}

const QuoteSchema = new Schema(
  {
    cstName: { type: String, trim: true },
    mobile: { type: String, trim: true },
    location: { type: String, trim: true },
    email: { type: String, trim: true },
    from: { type: Date },
    to: { type: Date },
    numberOfHours: { type: String, trim: true },
    numberOfKids: { type: String, trim: true },
    ageOfKidsFrom: { type: String, trim: true },
    ageOfKidsTo: { type: String, trim: true },
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

const Quote = models.Quote || model<IQuote>("Quote", QuoteSchema);

export default Quote;

// delete require.cache[require.resolve("../database/models/quote.model")];
// const Quote = require("../database/models/quote.model");
