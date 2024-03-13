import { Document, Schema, models, model } from "mongoose";
import { serviceErrs, setITError } from "@/constants/errors";
import { isValidUrl } from "@/lib/utils";

export interface IService extends Document {
  _id: string;
  serviceName: string;
  imgUrl: string;
  imgSize: number;
  serviceContent: string;
  createdAt: string;
  updatedAt: string;
}

const { serviceName, imgUrl, serviceContent } = serviceErrs;

const ServiceSchema = new Schema<IService>(
  {
    serviceName: {
      type: String,
      trim: true,
      required: [true, serviceName.errs.min],
    },
    imgUrl: {
      type: String,
      trim: true,
      required: [true, imgUrl.errs.min],
      validate: { validator: isValidUrl, message: imgUrl.errs.invalid },
    },
    imgSize: {
      type: Number,
      required: [true, setITError("service image size")],
    },
    serviceContent: {
      type: String,
      trim: true,
      required: [true, serviceContent.errs.min],
    },
  },
  { timestamps: true }
);

const Service = models.Service || model<IService>("Service", ServiceSchema);

export default Service;
