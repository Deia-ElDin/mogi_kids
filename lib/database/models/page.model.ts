import { Document, Schema, models, model } from "mongoose";

export interface IPage extends Document {
  _id: string;
  pageName: string;
  pageTitle: string;
  pageContent: string | null | undefined;
}

const PageSchema = new Schema({
  pageName: { type: String, trim: true, required: true },
  pageTitle: { type: String, trim: true, required: true },
  pageContent: { type: String, trim: true },
});

const Page = models.Page || model<IPage>("Page", PageSchema);

export default Page;
