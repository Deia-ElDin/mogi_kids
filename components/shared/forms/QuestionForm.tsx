"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// import { IQuestion } from "@/lib/database/models/question.model";
// import // createQuestion,
// // updateQuestion,
// // deleteQuestion,
// "@/lib/actions/question.actions";
import { questionSchema } from "@/lib/validators";
import { questionDefaultValues } from "@/constants";
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
import EditBtn from "../btns/EditBtn";
import CloseBtn from "../btns/CloseBtn";
import AddBtn from "../btns/AddBtn";
import SubmittingBtn from "../btns/SubmittingBtn";
import FormBtn from "../btns/FormBtn";
import * as z from "zod";

type Props = {
  // question: IQuestion | null;
  question: {} | null;
};

const QuestionForm: React.FC<Props> = () => {
  const [displayForm, setDisplayForm] = useState<boolean>(false);

  const form = useForm<z.infer<typeof questionSchema>>({
    resolver: zodResolver(questionSchema),
    defaultValues: questionDefaultValues,
  });

  const handleClose = () => {
    form.reset();
    setDisplayForm(false);
  };

  // useEffect(() => {
  //   form.reset(question ? question : questionDefaultValues);
  // }, [question]);

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
    if (!isValidForm(values)) return;
    // try {
    //   if (question) {
    //     await updateQuestion({
    //       ...values,
    //       _id: question._id,
    //     });
    //   } else await createQuestion({ ...values });
    //   setDisplayForm(false);
    //   form.reset();
    // } catch (error) {
    //   handleError(error);
    // }
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
            <CloseBtn handleClick={handleClose} />
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
            {form.formState.isSubmitting ? (
              <SubmittingBtn />
            ) : (
              <FormBtn text="Create Question" />
            )}
          </form>
        </Form>
      )}
    </>
  );
};

export default QuestionForm;
