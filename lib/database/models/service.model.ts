import { Document, Schema, model, models } from "mongoose";

export interface IService extends Document {
  _id: string;
  service: string;
  imgUrl: string;
  imgSize: number;
  serviceContent: string;
}

const ServiceSchema = new Schema({
  service: { type: String, trim: true, required: true },
  imgUrl: { type: String, trim: true, required: true },
  imgSize: { type: Number, required: true },
  serviceContent: { type: String, trim: true },
});

const ServiceModel =
  models.Service || model<IService>("Service", ServiceSchema);

export default ServiceModel;
