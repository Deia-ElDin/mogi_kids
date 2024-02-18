import { Document, Schema, models, model } from "mongoose";

export interface IUsage extends Document {
  _id: string;
  uploadThingDb: number;
}

const UsageSchema = new Schema({
  uploadThingDb: { type: Number, default: 0 },
});

const UsageModel = models.Usage || model<IUsage>("Usage", UsageSchema);

export default UsageModel;
