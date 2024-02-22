import { Document, Schema, models, model } from "mongoose";

export interface IContact extends Document {
  _id: string;
  svgUrl: string;
  imgSize: number;
  content: string;
}

const ContactSchema: Schema = new Schema<IContact>({
  svgUrl: { type: String, trim: true, required: true },
  imgSize: { type: Number, required: true },
  content: { type: String, trim: true, required: true },
});

const Contact = models.Contact || model<IContact>("Contact", ContactSchema);

export default Contact;
