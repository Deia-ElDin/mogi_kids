import { Document, Schema, models, model } from "mongoose";
import { IService } from "./service.model";

export interface IServicesPage extends Document {
  _id: string;
  title: string;
  content: string;
  services: IService[];
}

const ServicesPageSchema = new Schema({
  title: { type: String, trim: true, required: true },
  content: { type: String, trim: true },
  services: [{ type: Schema.Types.ObjectId, ref: "Service" }],
});

const ServicesPage =
  models.ServicesPage ||
  model<IServicesPage>("ServicesPage", ServicesPageSchema);

export default ServicesPage;
