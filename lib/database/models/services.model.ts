import { Document, Schema, model, models } from "mongoose";
import { IServiceCard } from "./service.model";

export interface IServicesPage extends Document {
  _id: string;
  title: string;
  content: string;
  services: IServiceCard[];
}

const ServicesPageSchema = new Schema({
  title: { type: String, trim: true },
  content: { type: String, trim: true },
  services: [{ type: Schema.Types.ObjectId, ref: "Service" }],
});

const ServicesPage =
  models.ServicesPage || model("ServicesPage", ServicesPageSchema);

export default ServicesPage;

// git mv -f OldFileNameCase newfilenamecase
