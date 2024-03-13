import { Document, Schema, models, model, Types } from "mongoose";

export interface IReport extends Document {
  _id: string;
  target: string;
  targetId: Types.ObjectId | string;
  createdAt: string;
  updatedAt: string;
  seen: boolean;
  createdBy: Types.ObjectId | string | null;
}

const ReportSchema = new Schema<IReport>(
  {
    target: { type: String, required: true },
    targetId: { type: Schema.Types.ObjectId, ref: "Review" || "Comment" },
    seen: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", immutable: true },
  },
  { timestamps: true }
);

const Report = models.Report || model<IReport>("Report", ReportSchema);

export default Report;
