import { questionsList } from "@/constants";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Title from "./utils/Title";

const Questions = () => {
  return (
    <section className="flex flex-col">
      <Title text="Frequently Asked Questions" />
      <Accordion type="single" collapsible className="w-full">
        {questionsList.map((item) => (
          <AccordionItem value={item.question}>
            <AccordionTrigger className="txt-xl text-yellow-800">
              {item.question}
            </AccordionTrigger>
            <AccordionContent>{item.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default Questions;
