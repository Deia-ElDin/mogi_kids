"use client";

import { useToast } from "../ui/use-toast";
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
import {
  deleteQuestion,
  deleteAllQuestions,
} from "@/lib/actions/question.actions";
import { handleError } from "@/lib/utils";
import { Separator } from "../ui/separator";
import Article from "./helpers/Article";
import PageForm from "./forms/PageForm";
import CreateQuestionForm from "./forms/CreateQuestionForm";
import UpdateQuestionForm from "./forms/UpdateQuestionForm";
import DeleteBtn from "./btns/DeleteBtn";

type QuestionsProps = {
  isAdmin: boolean | undefined;
  questionsPage: IPage | Partial<IPage>;
  questions: IQuestion[] | [];
};

const Questions: React.FC<QuestionsProps> = (props) => {
  const { isAdmin, questionsPage, questions } = props;

  const { toast } = useToast();

  const pageTitle = getPageTitle(
    questionsPage,
    isAdmin,
    "Questions Section Title"
  );
  const pageContent = getPageContent(questionsPage, isAdmin);

  const handleDeleteAll = async () => {
    try {
      if (questionsPage?._id) {
        const { success, error } = await deletePage(questionsPage._id, "/");
        if (!success && error) {
          if (typeof error === "string") {
            throw new Error(error);
          } else {
            throw error;
          }
        }
      }
      if (questions.length > 0) {
        const { success, error } = await deleteAllQuestions();
        if (!success && error) {
          if (typeof error === "string") {
            throw new Error(error);
          } else {
            throw error;
          }
        }
      }
      toast({ description: "Questions Page Deleted Successfully." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Delete Either The Questions Page or the Questions, ${handleError(
          error
        )}`,
      });
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      const { success, error } = await deleteQuestion(id);

      if (!success && error) {
        if (typeof error === "string") {
          throw new Error(error);
        } else {
          throw error;
        }
      }

      toast({ description: "Question Deleted Successfully." });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Delete The Question, ${handleError(error)}`,
      });
    }
  };

  return (
    <section className="section-style">
      <Article title={pageTitle} content={pageContent} />
      {questions?.length > 0 && (
        <>
          <Accordion type="single" collapsible className="w-full">
            {questions.map((questionObj, index) => (
              <AccordionItem
                key={`${questionObj.question}-${index}`}
                value={questionObj.question}
              >
                <AccordionTrigger className="question-style">
                  {questionObj.question}
                </AccordionTrigger>
                <div className="flex flex-col">
                  <AccordionContent className="answer-style">
                    {questionObj.answer}
                    <div className="flex">
                      {isAdmin && questionObj._id && (
                        <UpdateQuestionForm question={questionObj} />
                      )}
                      <DeleteBtn
                        pageId={questionsPage?._id}
                        isAdmin={isAdmin}
                        deletionTarget="Delete Question"
                        handleClick={() =>
                          handleDeleteQuestion(questionObj._id)
                        }
                      />
                    </div>
                  </AccordionContent>
                </div>
              </AccordionItem>
            ))}
          </Accordion>
        </>
      )}
      {isAdmin && <PageForm page={questionsPage} pageName="Questions Page" />}
      {isAdmin && questionsPage?._id && <CreateQuestionForm />}
      <DeleteBtn
        pageId={questionsPage?._id}
        isAdmin={isAdmin}
        deletionTarget="Delete Questions Section"
        handleClick={handleDeleteAll}
      />
      <Separator pageId={questionsPage?._id} isAdmin={isAdmin} />
    </section>
  );
};

export default Questions;

{
  /* <Title text="Frequently Asked Questions" /> */
}
