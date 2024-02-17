"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { IWelcomePage } from "@/lib/database/models/welcome.model";
import {
  createWelcomePage,
  updateWelcomePage,
} from "@/lib/actions/welcome.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { homePageSchema } from "@/lib/validators";
import { welcomeDefaultValues } from "@/constants";
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
import { Button } from "@/components/ui/button";
import { isValidForm, handleError } from "@/lib/utils";
import EditBtn from "../btns/EditBtn";
import CloseBtn from "../btns/CloseBtn";
import * as z from "zod";

type WelcomeFormProps = {
  isAdmin: boolean;
  welcomePage?: IWelcomePage | null;
};

const WelcomeForm = ({ isAdmin, welcomePage }: WelcomeFormProps) => {
  const [displayForm, setDisplayForm] = useState<boolean>(false);

  const pathname = usePathname();
  const initValues = welcomePage ? welcomePage : welcomeDefaultValues;

  const form = useForm<z.infer<typeof homePageSchema>>({
    resolver: zodResolver(homePageSchema),
    defaultValues: initValues,
  });

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape") setDisplayForm(false);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  async function onSubmit(values: z.infer<typeof homePageSchema>) {
    if (!isValidForm(values)) return;
    try {
      if (welcomePage) {
        await updateWelcomePage({
          ...values,
          _id: welcomePage._id,
          path: pathname,
        });
      } else await createWelcomePage({ ...values, path: pathname });
      setDisplayForm(false);
      form.reset();
    } catch (error) {
      handleError(error);
    }
  }

  return (
    <>
      <EditBtn
        isAdmin={isAdmin}
        handleClick={() => setDisplayForm((prev) => !prev)}
      />
      {displayForm && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="edit-form-style"
          >
            <CloseBtn handleClick={() => setDisplayForm(false)} />
            <h1 className="title-style text-white">Welcome Page</h1>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="label-style">Title</FormLabel>
                  <FormControl>
                    <Input {...field} className="edit-input-style text-style" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="label-style">Content</FormLabel>
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
            {/* <Error errMsg={invalidForm ? "Invalid Form" : null} /> */}
            <div className="w-full flex justify-center md:col-span-2">
              <Button type="submit" className="form-btn label-style">
                {welcomePage ? "Update" : "Create"} Welcome Page
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
};

export default WelcomeForm;
