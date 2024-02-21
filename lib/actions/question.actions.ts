import { revalidatePath } from "next/cache";
import { connectToDb } from "../database";
import { handleError } from "../utils";
import { CreateQuestionParams, UpdateQuestionParams } from "@/types";
import Question from "../database/models/question.model";

export async function getAllQuestions() {
  try {
    console.log("here 00");
    await connectToDb();
    console.log("here 11");
    const questions = await Question.find();
    return JSON.parse(JSON.stringify(questions));
  } catch (error) {
    handleError(error);
    return null;
  }
}

export async function createQuestion(params: CreateQuestionParams) {
  const { question, answer } = params;
  console.log("params", params);

  try {
    console.log("here 0");
    await connectToDb();

    console.log("here 1");

    const newQuestion = await Question.create({ question, answer });
    console.log("here 2");

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

    return null;
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
    return null;
  } catch (error) {
    handleError(error);
  }
}
