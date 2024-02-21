import { Document, Schema, models, model } from "mongoose";

export interface IService extends Document {
  _id: string;
  serviceName: string;
  imgUrl: string;
  imgSize: number;
  serviceContent: string;
  createdAt?: string;
}

const ServiceSchema = new Schema<IService>({
  serviceName: { type: String, trim: true, required: true },
  imgUrl: { type: String, trim: true, required: true },
  imgSize: { type: Number, required: true },
  serviceContent: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now() },
});

const Service = models.Service || model<IService>("Service", ServiceSchema);

export default Service;
