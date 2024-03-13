import { Document, Schema, models, model } from "mongoose";
import { aboutUsErrs, setITError } from "@/constants/errors";
import { isValidUrl } from "@/lib/utils";

export interface IAboutUs extends Document {
  _id: string;
  title: string;
  content: string;
  imgUrl: string;
  imgSize: number;
}

const { title, content, imgUrl } = aboutUsErrs;

const AboutUsSchema: Schema = new Schema<IAboutUs>({
  title: {
    type: String,
    trim: true,
    required: [true, title.errs.min],
  },
  content: { type: String, trim: true, required: [true, content.errs.min] },
  imgUrl: {
    type: String,
    trim: true,
    required: [true, imgUrl.errs.min],
    validate: { validator: isValidUrl, message: imgUrl.errs.invalid },
  },
  imgSize: {
    type: Number,
    required: [true, setITError("about us image size")],
  },
});

const AboutUs = models.About_Us || model<IAboutUs>("About_Us", AboutUsSchema);

export default AboutUs;
