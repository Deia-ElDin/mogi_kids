"use server";

import { connectToDb } from "../database";
import { CreateQuestionParams, UpdateQuestionParams } from "@/types";
import { handleError } from "../utils";
import { revalidatePath } from "next/cache";
import Question, { IQuestion } from "../database/models/question.model";

type GetALLResult = {
  success: boolean;
  data: IQuestion[] | [] | null;
  error: string | null;
};

type DefaultResult = {
  success: boolean;
  data: IQuestion | null;
  error: string | null;
};

type DeleteResult = {
  success: boolean;
  data: null;
  error: string | null;
};

export async function getAllQuestions(): Promise<GetALLResult> {
  try {
    await connectToDb();

    const questions = await Question.find();

    const data = JSON.parse(JSON.stringify(questions));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function createQuestion(
  params: CreateQuestionParams
): Promise<DefaultResult> {
  try {
    await connectToDb();

    const newQuestion = await Question.create(params);

    if (!newQuestion)
      throw new Error(
        "Couldn't create a question & kindly check the uploadthing database"
      );

    revalidatePath("/");

    const data = JSON.parse(JSON.stringify(newQuestion));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function updateQuestion(
  params: UpdateQuestionParams
): Promise<DefaultResult> {
  const { _id, question, answer } = params;

  try {
    await connectToDb();

    const updatedQuestion = await Question.findByIdAndUpdate(_id, {
      question,
      answer,
    });

    revalidatePath("/");

    const data = JSON.parse(JSON.stringify(updatedQuestion));

    return { success: true, data, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function deleteQuestion(
  questionId: string
): Promise<DeleteResult> {
  try {
    await connectToDb();

    const deletedQuestion = await Question.findByIdAndDelete(questionId);
    if (!deletedQuestion)
      throw new Error("Question not found or already deleted.");

    revalidatePath("/");

    return { success: true, data: null, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}

export async function deleteAllQuestions(): Promise<DeleteResult> {
  try {
    await connectToDb();

    const deletedQuestions = await Question.deleteMany();

    if (!deletedQuestions)
      throw new Error("Questions not found or already deleted.");

    revalidatePath("/");

    return { success: true, data: null, error: null };
  } catch (error) {
    return { success: false, data: null, error: handleError(error) };
  }
}
