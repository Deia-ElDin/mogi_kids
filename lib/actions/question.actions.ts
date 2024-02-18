import { revalidatePath } from "next/cache";
import { connectToDb } from "../database";
import { handleError } from "../utils";
import { CreateQuestionParams, UpdateQuestionParams } from "@/types";
import Question from "../database/models/question.model";

export async function getAllQuestions() {
  try {
    await connectToDb();

    const questions = await Question.find();
    return JSON.parse(JSON.stringify(questions));
  } catch (error) {
    handleError(error);
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  const { question, answer } = params;

  try {
    await connectToDb();

    const newQuestion = await Question.create({ question, answer });
    revalidatePath("/");
    return JSON.parse(JSON.stringify(newQuestion));
  } catch (error) {
    handleError(error);
  }
}

export async function updateQuestion(params: UpdateQuestionParams) {
  const { _id, question, answer } = params;

  try {
    await connectToDb();

    const newQuestion = await Question.findByIdAndUpdate(_id, {
      question,
      answer,
    });

    revalidatePath("/");
    return JSON.parse(JSON.stringify(newQuestion));
  } catch (error) {
    handleError(error);
  }
}

export async function deleteQuestion(questionId: string) {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(questionId);
    if (!deletedQuestion)
      throw new Error("Question not found or already deleted.");

    revalidatePath("/");

    return null;
  } catch (error) {
    handleError(error);
  }
}
