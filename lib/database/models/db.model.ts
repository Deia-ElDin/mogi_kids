import { Document, Schema, models, model } from "mongoose";

export interface IDb extends Document {
  _id: string;
  resend: string;
  uploadthing: string;
  mongo: string;
  clerk: string;
  today: Date;
}

const DbSchema: Schema = new Schema<IDb>(
  {
    resend: { type: String, default: "0" },
    uploadthing: { type: String, default: "0" },
    mongo: { type: String, default: "0" },
    clerk: { type: String, default: "0" },
    today: { type: Date, default: new Date() },
  },
  { timestamps: true }
);

const Db = models.Db || model<IDb>("Db", DbSchema);

export default Db;
