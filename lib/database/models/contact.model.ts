import { Document, Schema, models, model } from "mongoose";
import { contactErrs, setITError } from "@/constants/errors";

export interface IContact extends Document {
  _id: string;
  imgUrl: string;
  imgSize: number;
  content: string;
}

const ContactSchema: Schema = new Schema<IContact>({
  imgUrl: {
    type: String,
    trim: true,
    required: [true, contactErrs.imgUrl.errs.min],
  },
  imgSize: {
    type: Number,
    required: [true, setITError("contact icon size")],
  },
  content: {
    type: String,
    trim: true,
    required: [true, contactErrs.content.errs.min],
  },
});

const Contact = models.Contact || model<IContact>("Contact", ContactSchema);

export default Contact;
