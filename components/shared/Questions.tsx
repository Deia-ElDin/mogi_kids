import { questionsList } from "@/constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Title from "./helpers/Title";
import Breaker from "./helpers/Breaker";

const Questions = () => (
  <section className="flex flex-col">
    <Title text="Frequently Asked Questions" />
    <Accordion type="single" collapsible className="w-full">
      {questionsList.map((item) => (
        <AccordionItem key={item.question} value={item.question}>
          <AccordionTrigger className="txt-xl text-left text-yellow-800">
            {item.question}
          </AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
    <Breaker />
  </section>
);

export default Questions;
