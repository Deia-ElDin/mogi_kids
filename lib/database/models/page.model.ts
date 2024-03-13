import { Document, Schema, models, model } from "mongoose";
import { webPageErrs, setITError } from "@/constants/errors";
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
    required: [true, setITError("Page Naming Error.")],
    validate: [
      {
        validator: function (value: string) {
          return isInArray(value, webPages);
        },
        message: setITError("Page Naming Error."),
      },
      {
        validator: isEmpty,
        message: setITError("Page Naming Error."),
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
