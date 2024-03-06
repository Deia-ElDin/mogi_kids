import { Document, Schema, models, model } from "mongoose";

export interface IDb extends Document {
  _id: string;
  resend?: string;
  uploadthing?: string;
  mongo?: string;
  clerk?: string;
  today: Date;
}

const DbSchema: Schema = new Schema<IDb>(
  {
    resend: { type: String, default: null },
    uploadthing: { type: String, default: null },
    mongo: { type: String, default: null },
    clerk: { type: String, default: null },
    today: { type: Date, default: new Date() },
  },
  { timestamps: true }
);

const Db = models.Db || model<IDb>("Db", DbSchema);

export default Db;
