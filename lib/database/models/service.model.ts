import { Document, Schema, model, models } from "mongoose";

export interface IServiceCard {
  _id: string;
  service: string;
  imgUrl: string;
  content: string;
}

const ServiceSchema = new Schema({
  service: { type: String, trim: true, required: true },
  imgUrl: { type: String, trim: true, required: true },
  content: { type: String, trim: true },
});

const Service = models.Service || model("Service", ServiceSchema);

export default Service;

// git mv -f OldFileNameCase newfilenamecase
