import { Document, Schema, model, models } from "mongoose";
import { IService } from "./service.model";

export interface IServicesPage extends Document {
  _id: string;
  title: string;
  content: string;
  services: IService[];
}

const ServicesPageSchema = new Schema({
  title: { type: String, trim: true },
  content: { type: String, trim: true },
  services: [{ type: Schema.Types.ObjectId, ref: "Service" }],
});

const ServicesPageModel =
  models.ServicesPage ||
  model<IServicesPage>("ServicesPage", ServicesPageSchema);

export default ServicesPageModel;
