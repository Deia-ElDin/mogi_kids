import { Document, Schema, models, model } from "mongoose";
import { contactErrs, setITError } from "@/constants/errors";
import { isValidUrl } from "@/lib/utils";

export interface IContact extends Document {
  _id: string;
  imgUrl: string;
  imgSize: number;
  content: string;
}

const { imgUrl, content } = contactErrs;

const ContactSchema: Schema = new Schema<IContact>({
  imgUrl: {
    type: String,
    trim: true,
    required: [true, imgUrl.errs.min],
    validate: { validator: isValidUrl, message: imgUrl.errs.invalid },
  },
  imgSize: {
    type: Number,
    required: [true, setITError("contact icon size")],
  },
  content: {
    type: String,
    trim: true,
    required: [true, content.errs.min],
  },
});

const Contact = models.Contact || model<IContact>("Contact", ContactSchema);

export default Contact;
