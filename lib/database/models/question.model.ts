import { Document, Schema, models, model } from "mongoose";
import { questionErrs } from "@/constants/errors";

export interface IQuestion extends Document {
  _id: string;
  question: string;
  answer: string;
}

const QuestionSchema = new Schema<IQuestion>({
  question: {
    type: String,
    trim: true,
    required: [true, questionErrs.question.errs.min],
  },
  answer: {
    type: String,
    trim: true,
    required: [true, questionErrs.answer.errs.min],
  },
});

const Question =
  models.Question || model<IQuestion>("Question", QuestionSchema);

export default Question;
