import { auth } from "@clerk/nextjs";
import { getUserByUserId } from "@/lib/actions/user.actions";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getAllQuestions } from "@/lib/actions/question.actions";
// import { IQuestion } from "@/lib/database/models/question.model";
import { Separator } from "../ui/separator";
import Article from "./helpers/Article";
import Title from "./helpers/Title";

const Questions = async () => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;
  const user = await getUserByUserId(userId);
  const isAdmin = user?.role === "Admin";
  // const questionsList: IQuestion[] = await getAllQuestions();
  const questionsList = await getAllQuestions();

  return (
    <section className="section-style">
      {questionsList.length === 0 ? (
        <Article title="Questions Section Title" content="Content" />
      ) : (
        <>
          <Title text="Frequently Asked Questions" />
          <Accordion type="single" collapsible className="w-full">
            {questionsList.map((questionObj: any) => (
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
      {/* {isAdmin && <QuestionForm />} */}
      <Separator />
    </section>
  );
};

export default Questions;
