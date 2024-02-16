import { Document, Schema, model, models } from "mongoose";

export interface IServicePage extends Document {
  _id: string;
  title: string;
  content: string;
  services: IServiceCard[];
}

export interface IServiceCard {
  _id: string;
  service: string;
  imgUrl: string;
  content: string;
}

const ServicePageSchema = new Schema({
  title: { type: String, trim: true },
  content: { type: String, trim: true },
  services: [
    {
      service: { type: String, trim: true },
      imgUrl: String,
      content: { type: String, trim: true },
    },
  ],
});

const ServicePage =
  models.ServicePage || model("ServicePage", ServicePageSchema);

export default ServicePage;

// git mv -f OldFileNameCase newfilenamecase
