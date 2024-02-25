import { Document, Schema, models, model } from "mongoose";

export interface IAboutUs extends Document {
  _id: string;
  title: string;
  content: string;
  imgUrl: string;
  imgSize: number;
}

const AboutUsSchema: Schema = new Schema<IAboutUs>({
  title: { type: String, trim: true, required: true },
  content: { type: String, trim: true, required: true },
  imgUrl: { type: String, trim: true, required: true },
  imgSize: { type: Number, required: true },
});

const AboutUs = models.AboutUs || model<IAboutUs>("About Us", AboutUsSchema);

export default AboutUs;
