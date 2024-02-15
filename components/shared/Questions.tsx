import { questionsList } from "@/constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Title from "./helpers/Title";
import { Separator } from "../ui/separator";


const Questions = () => (
  <section id="questions" className="section-style">
    <Title text="Frequently Asked Questions" />
    <Accordion type="single" collapsible className="w-full">
      {questionsList.map((item) => (
        <AccordionItem key={item.question} value={item.question}>
          <AccordionTrigger className="question-style">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="answer-style">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
    <Separator />
  </section>
);

export default Questions;
