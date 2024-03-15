"use server";

import { connectToDb } from "../database";
import { validateAdmin } from "./validation.actions";
import { CreateQuestionParams, UpdateQuestionParams } from "@/types";
import { handleServerError } from "../utils";
import { revalidatePath } from "next/cache";
import {
  UnauthorizedError,
  UnprocessableEntity,
  NotFoundError,
} from "../errors";
import Question, { IQuestion } from "../database/models/question.model";

type GetALLResult = {
  success: boolean;
  data: IQuestion[] | [] | null;
  error: string | null;
  statusCode: number;
};

type DefaultResult = {
  success: boolean;
  data: IQuestion | null;
  error: string | null;
  statusCode: number;
};

type DeleteResult = {
  success: boolean;
  data: null;
  error: string | null;
  statusCode: number;
};

export async function getAllQuestions(): Promise<GetALLResult> {
  try {
    await connectToDb();

    const questions = await Question.find();

    const data = JSON.parse(JSON.stringify(questions));

    return { success: true, data, error: null, statusCode: 200 };
  } catch (error) {
    const { message, statusCode } = handleServerError(error as Error);
    return {
      success: false,
      data: null,
      error: message,
      statusCode: statusCode,
    };
  }
}

export async function createQuestion(
  params: CreateQuestionParams
): Promise<DefaultResult> {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new UnauthorizedError("Not Authorized to access this resource.");

    const newQuestion = await Question.create(params);

    if (!newQuestion)
      throw new UnprocessableEntity(
        "Couldn't create a question & kindly check the uploadthing database"
      );

    const data = JSON.parse(JSON.stringify(newQuestion));

    revalidatePath("/");

    return { success: true, data, error: null, statusCode: 201 };
  } catch (error) {
    const { message, statusCode } = handleServerError(error as Error);
    return {
      success: false,
      data: null,
      error: message,
      statusCode: statusCode,
    };
  }
}

export async function updateQuestion(
  params: UpdateQuestionParams
): Promise<DefaultResult> {
  const { _id, question, answer } = params;

  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new UnauthorizedError("Not Authorized to access this resource.");

    const updatedQuestion = await Question.findByIdAndUpdate(_id, {
      question,
      answer,
    });

    const data = JSON.parse(JSON.stringify(updatedQuestion));

    revalidatePath("/");

    return { success: true, data, error: null, statusCode: 201 };
  } catch (error) {
    const { message, statusCode } = handleServerError(error as Error);
    return {
      success: false,
      data: null,
      error: message,
      statusCode: statusCode,
    };
  }
}

export async function deleteQuestion(
  questionId: string
): Promise<DeleteResult> {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new UnauthorizedError("Not Authorized to access this resource.");

    const deletedQuestion = await Question.findByIdAndDelete(questionId);
    if (!deletedQuestion)
      throw new NotFoundError("Question not found or already deleted.");

    revalidatePath("/");

    return { success: true, data: null, error: null, statusCode: 204 };
  } catch (error) {
    const { message, statusCode } = handleServerError(error as Error);
    return {
      success: false,
      data: null,
      error: message,
      statusCode: statusCode,
    };
  }
}

export async function deleteAllQuestions(): Promise<DeleteResult> {
  try {
    await connectToDb();

    const { isAdmin, error } = await validateAdmin();

    if (error || !isAdmin)
      throw new UnauthorizedError("Not Authorized to access this resource.");

    const deletedQuestions = await Question.deleteMany();

    if (!deletedQuestions)
      throw new NotFoundError("Questions not found or already deleted.");

    revalidatePath("/");

    return { success: true, data: null, error: null, statusCode: 204 };
  } catch (error) {
    const { message, statusCode } = handleServerError(error as Error);
    return {
      success: false,
      data: null,
      error: message,
      statusCode: statusCode,
    };
  }
}
