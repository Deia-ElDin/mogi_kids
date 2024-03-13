import { Document, Schema, models, model } from "mongoose";
import { serviceErrs, setITError } from "@/constants/errors";

export interface IService extends Document {
  _id: string;
  serviceName: string;
  imgUrl: string;
  imgSize: number;
  serviceContent: string;
  createdAt: string;
  updatedAt: string;
}

const ServiceSchema = new Schema<IService>(
  {
    serviceName: {
      type: String,
      trim: true,
      required: [true, serviceErrs.serviceName.errs.min],
    },
    imgUrl: {
      type: String,
      trim: true,
      required: [true, serviceErrs.imgUrl.errs.min],
    },
    imgSize: {
      type: Number,
      required: [true, setITError("service image size")],
    },
    serviceContent: {
      type: String,
      trim: true,
      required: [true, serviceErrs.serviceContent.errs.min],
    },
  },
  { timestamps: true }
);

const Service = models.Service || model<IService>("Service", ServiceSchema);

export default Service;
