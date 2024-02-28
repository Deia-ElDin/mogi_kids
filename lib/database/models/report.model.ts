import { Document, Schema, models, model, Types } from "mongoose";

export interface IReport extends Document {
  _id: string;
  target: string;
  targetId: Types.ObjectId | string;
  createdBy: Types.ObjectId | string | null;
}

const ReportSchema = new Schema<IReport>(
  {
    target: { type: String, required: true },
    targetId: {
      type: Schema.Types.ObjectId,
      ref: "User" || "Review" || "Comment",
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Report = models.Report || model<IReport>("Report", ReportSchema);

export default Report;
