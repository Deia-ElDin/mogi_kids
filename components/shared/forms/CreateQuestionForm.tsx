"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
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
import { handleError } from "@/lib/utils";
import { createQuestion } from "@/lib/actions/question.actions";
import { questionSchema } from "@/lib/validators";
import { questionDefaultValues } from "@/constants";
import AddBtn from "../btns/AddBtn";
import CloseBtn from "../btns/CloseBtn";
import FormBtn from "../btns/FormBtn";
import * as z from "zod";

const CreateQuestionForm: React.FC = () => {
  const [displayForm, setDisplayForm] = useState<boolean>(false);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: questionDefaultValues,
  });

  const handleClose = () => {
    form.reset();
    setDisplayForm(false);
  };

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  async function onSubmit(values: z.infer<typeof questionSchema>) {
    try {
      const validationResult = questionSchema.safeParse(values);

      if (!validationResult.success)
        throw new Error(validationResult.error.message);

      const { success, error } = await createQuestion({ ...values });

      if (!success && error) {
        if (typeof error === "string") {
          throw new Error(error);
        } else {
          throw error;
        }
      }
      toast({ description: "Question Created Successfully." });
      handleClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Create The Question, ${handleError(error)}`,
      });
    }
  }

  return (
    <>
      <AddBtn handleClick={() => setDisplayForm((prev) => !prev)} />
      {displayForm && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="form-style">
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
              text="Create Question"
              isSubmitting={form.formState.isSubmitting}
            />
          </form>
        </Form>
      )}
    </>
  );
};

export default CreateQuestionForm;
