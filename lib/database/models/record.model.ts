import {
  Document,
  Schema,
  models,
  model,
  CallbackWithoutResultAndOptionalError,
} from "mongoose";
import { generateBackgroundColor } from "@/lib/utils";

export interface IRecord extends Document {
  _id: string;
  svgUrl: string;
  number: string;
  label: string;
  backgroundColor: string;
}

const RecordSchema = new Schema({
  svgUrl: { type: String, required: true, trim: true },
  number: { type: Number, required: true },
  label: { type: String, required: true, trim: true },
  backgroundColor: { type: String, trim: true },
});

RecordSchema.pre<IRecord>(
  "save",
  async function (next: CallbackWithoutResultAndOptionalError) {
    if (!this.backgroundColor) {
      this.backgroundColor = generateBackgroundColor();
    }
    next();
  }
);

const Record = models.Record || model<IRecord>("Record", RecordSchema);

export default Record;
