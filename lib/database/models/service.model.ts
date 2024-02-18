import { Document, Schema, model, models } from "mongoose";

export interface IService extends Document {
  _id: string;
  service: string;
  imgUrl: string;
  serviceContent: string;
}

const ServiceSchema = new Schema({
  service: { type: String, trim: true, required: true },
  imgUrl: { type: String, trim: true, required: true },
  serviceContent: { type: String, trim: true },
});

const Service = models.Service || model("Service", ServiceSchema);

export default Service;
