"use server";

import { connectToDb } from "../database";
import { CreateQuestionParams, UpdateQuestionParams } from "@/types";
import { handleError } from "../utils";
import { revalidatePath } from "next/cache";
import Question from "../database/models/question.model";

export async function getAllQuestions() {
  try {
    await connectToDb();

    const questions = await Question.find();

    return JSON.parse(JSON.stringify(questions));
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  try {
    await connectToDb();

    const newQuestion = await Question.create(params);

    if (!newQuestion)
      throw new Error(
        "Couldn't create a service & kindly check the uploadthing database"
      );

    revalidatePath("/");

    return JSON.parse(JSON.stringify(newQuestion));
  } catch (error) {
    console.log("here 3");
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
    await connectToDb();

    const deletedQuestion = await Question.findByIdAndDelete(questionId);
    if (!deletedQuestion)
      throw new Error("Question not found or already deleted.");

    revalidatePath("/");

    return "Question deleted successfully";
  } catch (error) {
    handleError(error);
  }
}

export async function deleteAllQuestions() {
  try {
    await connectToDb();

    const deletedQuestions = await Question.deleteMany();

    if (!deletedQuestions)
      throw new Error("Questions not found or already deleted.");

    revalidatePath("/");

    return "All questions deleted successfully";
  } catch (error) {
    handleError(error);
  }
}
