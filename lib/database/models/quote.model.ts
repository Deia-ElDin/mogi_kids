import { Document, Schema, models, model } from "mongoose";

export interface IQuote extends Document {
  _id: string;
  cstName?: string;
  mobile?: string;
  location?: string;
  email?: string;
  from?: Date;
  to?: Date;
  numberOfHours?: string;
  numberOfKids?: string;
  ageOfKidsFrom?: string;
  ageOfKidsTo?: string;
  extraInfo?: string;
  createdAt?: Date;
  emailSent: boolean;
}

const QuoteSchema = new Schema({
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
  createdAt: { type: Date, default: Date.now() },
  emailSent: { type: Boolean, default: false },
});

const Quote = models.Quote || model<IQuote>("Quote", QuoteSchema);

export default Quote;
