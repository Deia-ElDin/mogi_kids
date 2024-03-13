import { Document, Schema, models, model } from "mongoose";
import { recordErrs, setITError } from "@/constants/errors";

export interface IRecord extends Document {
  _id: string;
  imgUrl: string;
  imgSize: number;
  value: string;
  label: string;
}

const RecordSchema = new Schema<IRecord>({
  imgUrl: {
    type: String,
    trim: true,
    required: [true, recordErrs.imgUrl.errs.min],
  },
  imgSize: { type: Number, required: [true, setITError("record icon size")] },
  value: {
    type: String,
    trim: true,
    required: [true, recordErrs.value.errs.min],
  },
  label: {
    type: String,
    trim: true,
    required: [true, recordErrs.label.errs.min],
  },
});

const Record = models.Record || model<IRecord>("Record", RecordSchema);

export default Record;
