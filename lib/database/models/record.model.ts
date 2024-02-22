import {
  Document,
  Schema,
  models,
  model,
} from "mongoose";

export interface IRecord extends Document {
  _id: string;
  imgUrl: string;
  imgSize: number;
  value: string;
  label: string;
}

const RecordSchema = new Schema<IRecord>({
  imgUrl: { type: String, trim: true, required: true },
  imgSize: { type: Number, required: true },
  value: { type: String, trim: true, required: true },
  label: { type: String, trim: true, required: true },
});


const Record = models.Record || model<IRecord>("Record", RecordSchema);

export default Record;
