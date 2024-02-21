import { Document, Schema, models, model } from "mongoose";

export interface ICst extends Document {
  _id: string;
  review: string;
}

const CstSchema = new Schema({
  review: { type: String, trim: true, required: true },
});

const Cst = models.Cst || model<ICst>("Cst", CstSchema);

export default Cst;
