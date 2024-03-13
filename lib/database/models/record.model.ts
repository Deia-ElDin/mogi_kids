import { Document, Schema, models, model } from "mongoose";
import { recordErrs, setITError } from "@/constants/errors";
import { isValidUrl } from "@/lib/utils";

export interface IRecord extends Document {
  _id: string;
  imgUrl: string;
  imgSize: number;
  value: string;
  label: string;
}

const { imgUrl, value, label } = recordErrs;

const RecordSchema = new Schema<IRecord>({
  imgUrl: {
    type: String,
    trim: true,
    required: [true, imgUrl.errs.min],
    validate: { validator: isValidUrl, message: imgUrl.errs.invalid },
  },
  imgSize: { type: Number, required: [true, setITError("record icon size")] },
  value: {
    type: String,
    trim: true,
    required: [true, value.errs.min],
  },
  label: {
    type: String,
    trim: true,
    required: [true, label.errs.min],
  },
});

const Record = models.Record || model<IRecord>("Record", RecordSchema);

export default Record;
