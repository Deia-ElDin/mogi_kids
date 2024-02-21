"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { IQuestion } from "@/lib/database/models/question.model";
import { IPage } from "@/lib/database/models/page.model";
import { getPageContent, getPageTitle } from "@/lib/utils";
import { deletePage } from "@/lib/actions/page.actions";
import { deleteAllQuestions } from "@/lib/actions/question.actions";
import { handleError } from "@/lib/utils";
import { Separator } from "../ui/separator";
import Article from "./helpers/Article";
import PageForm from "./forms/PageForm";
import QuestionForm from "./forms/QuestionForm";
import DeleteBtn from "./btns/DeleteBtn";

type QuestionsProps = {
  isAdmin: boolean | undefined;
  questionsPage: IPage | Partial<IPage> | undefined;
  questions: IQuestion[] | [];
};

const Questions = (props: QuestionsProps) => {
  const { isAdmin, questionsPage, questions } = props;

  const pageTitle = getPageTitle(questionsPage, isAdmin, "Questions Page");
  const pageContent = getPageContent(questionsPage, isAdmin);

  const handleDelete = async () => {
    try {
      if (questionsPage?._id) await deletePage(questionsPage._id, "/");
      if (questions.length > 0) await deleteAllQuestions();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <section className="section-style">
      <Article title={pageTitle} content={pageContent} />
      {questions?.length > 0 && (
        <>
          <Accordion type="single" collapsible className="w-full">
            {questions.map((questionObj) => (
              <AccordionItem
                key={questionObj.question}
                value={questionObj.question}
              >
                <AccordionTrigger className="question-style">
                  {questionObj.question}
                </AccordionTrigger>
                <AccordionContent className="answer-style">
                  {questionObj.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </>
      )}
      {isAdmin && <PageForm page={questionsPage} pageName="Questions Page" />}
      <QuestionForm isAdmin={isAdmin} question={null} />
      <DeleteBtn
        pageId={questionsPage?._id}
        isAdmin={isAdmin}
        deletionTarget="Services Section"
        handleClick={handleDelete}
      />
      <Separator pageId={questionsPage?._id} isAdmin={isAdmin} />
    </section>
  );
};

export default Questions;

{
  /* <Title text="Frequently Asked Questions" /> */
}
