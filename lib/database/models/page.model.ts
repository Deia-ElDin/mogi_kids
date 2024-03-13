import { Document, Schema, models, model } from "mongoose";
import { webPageErrs } from "@/constants/errors";
import { webPages } from "@/constants";
import { isEmpty, isInArray } from "@/lib/utils";

export interface IPage extends Document {
  _id: string;
  pageName: string;
  pageTitle: string;
  pageContent?: string;
}

const PageSchema = new Schema<IPage>({
  pageName: {
    type: String,
    trim: true,
    required: [true, "Connect with the IT department, Page Naming Error."],
    validate: [
      {
        validator: function (value: string) {
          return isInArray(value, webPages);
        },
        message: "Connect with the IT department, Page Naming Error.",
      },
      {
        validator: isEmpty,
        message: "Connect with the IT department, Page Naming Error.",
      },
    ],
  },
  pageTitle: {
    type: String,
    trim: true,
    required: [true, webPageErrs.err],
  },
  pageContent: { type: String, trim: true },
});

const Page = models.Page || model<IPage>("Page", PageSchema);

export default Page;
