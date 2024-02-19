import { Document, Schema, models, model } from "mongoose";

export interface IQuestion extends Document {
  _id: string;
  question: string;
  answer: string;
}

const QuestionSchema = new Schema({
  question: { type: String, trim: true, required: true },
  answer: { type: String, trim: true, required: true },
  pageContent: { type: String, trim: true },
});

const Question =
  models.Question || model<IQuestion>("Question", QuestionSchema);

export default Question;
