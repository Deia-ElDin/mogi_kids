import { Document, Schema, models, model, Types } from "mongoose";

export interface ICareer extends Document {
  _id: string;
  fullName: string;
  email: string;
  mobile: string;
  applyingFor: string;
  workingAt: string;
  previousSalary: string;
  expectedSalary: string;
  joinDate: Date;
  gender: string;
  education: string;
  dhaCertificate: string;
  careGiverCertificate: string;
  experienceInUAE: string[];
  visa: string;
  visaExpireDate: Date;
  coverLetter: string;
  imgUrl: string;
  imgSize: number;
  blocked: boolean;
  seen: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: Types.ObjectId | string;
}
const CareerSchema = new Schema<ICareer>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    mobile: { type: String, required: true, trim: true },
    applyingFor: { type: String, required: true, trim: true },
    workingAt: { type: String, required: true, trim: true },
    previousSalary: { type: String, trim: true },
    expectedSalary: { type: String, trim: true },
    joinDate: { type: Date, required: true },
    gender: { type: String, required: true },
    education: { type: String, required: true },
    dhaCertificate: { type: String, required: true },
    careGiverCertificate: { type: String, required: true },
    experienceInUAE: { type: [String], required: true, trim: true },
    visa: { type: String, required: true },
    visaExpireDate: { type: Date, required: true },
    coverLetter: { type: String, trim: true },
    imgUrl: { type: String, required: true },
    imgSize: { type: Number },
    blocked: { type: Boolean, default: false },
    seen: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const Career = models.Career || model<ICareer>("Career", CareerSchema);

export default Career;
