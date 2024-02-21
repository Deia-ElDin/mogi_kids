"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { isValidForm, handleError } from "@/lib/utils";
import { IQuestion } from "@/lib/database/models/question.model";
import { IPage } from "@/lib/database/models/page.model";
import { questionSchema } from "@/lib/validators";
import { questionDefaultValues } from "@/constants";
import AddBtn from "../btns/AddBtn";
import CloseBtn from "../btns/CloseBtn";
import FormBtn from "../btns/FormBtn";
import * as z from "zod";

type QuestionFormProps = {
  isAdmin: boolean | undefined;
  question: IQuestion | Partial<IQuestion> | undefined | null;
};

const QuestionForm = ({ isAdmin, question }: QuestionFormProps) => {
  if (!isAdmin) return;

  const [displayForm, setDisplayForm] = useState<boolean>(false);
  const pathname = usePathname();

  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: question ? question : questionDefaultValues,
  });

  useEffect(() => {
    form.reset(question ? question : questionDefaultValues);
  }, [question]);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape") setDisplayForm(false);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  async function onSubmit(values: z.infer<typeof questionSchema>) {
    if (!isValidForm(values)) return;

    try {
      // if (question?._id) {
      //   await updatePage({
      //     ...values,
      //     _id: page._id!,
      //     path: pathname,
      //   });
      // } else await createPage({ ...values, path: pathname });
      setDisplayForm(false);
      form.reset();
    } catch (error) {
      handleError(error);
    }
  }

  return (
    <>
      <AddBtn handleClick={() => setDisplayForm((prev) => !prev)} />
      {displayForm && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="edit-form-style"
          >
            <CloseBtn handleClick={() => setDisplayForm(false)} />
            <h1 className="title-style text-white">Question Form</h1>
            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="label-style">Question</FormLabel>
                  <FormControl>
                    <Input {...field} className="edit-input-style text-style" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="label-style">Answer</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      className="edit-textarea-style text-style"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormBtn
              text={`${question?._id ? "Edit" : "Create"} Question`}
              isSubmitting={form.formState.isSubmitting}
            />
          </form>
        </Form>
      )}
    </>
  );
};

export default QuestionForm;
