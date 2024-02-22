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
import { handleError } from "@/lib/utils";
import { IPage } from "@/lib/database/models/page.model";
import { pageSchema } from "@/lib/validators";
import { pageDefaultValues } from "@/constants";
import { createPage, updatePage } from "@/lib/actions/page.actions";
import EditBtn from "../btns/EditBtn";
import CloseBtn from "../btns/CloseBtn";
import FormBtn from "../btns/FormBtn";
import * as z from "zod";

type PageProps = {
  page: IPage | Partial<IPage> | undefined;
  pageName:
    | "Welcome Page"
    | "Services Page"
    | "Questions Page"
    | "Records Page"
    | "Customers Page"
    | "Customers Welcoming Page"
    | "Quote Page"
    | "Contacts Page";
};

const PageForm = ({ page, pageName }: PageProps) => {
  const [displayForm, setDisplayForm] = useState<boolean>(false);
  const pathname = usePathname();

  const form = useForm<z.infer<typeof pageSchema>>({
    resolver: zodResolver(pageSchema),
    defaultValues: page ? page : pageDefaultValues,
  });

  useEffect(() => {
    form.reset(page ? page : pageDefaultValues);
  }, [page]);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape") setDisplayForm(false);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  async function onSubmit(values: z.infer<typeof pageSchema>) {
    values.pageName = pageName;
    try {
      if (page?._id) {
        await updatePage({
          ...values,
          _id: page._id!,
          path: pathname,
        });
      } else await createPage({ ...values, path: pathname });
      setDisplayForm(false);
      form.reset();
    } catch (error) {
      handleError(error);
    }
  }

  return (
    <>
      <EditBtn
        centeredPosition={page?.pageTitle ? false : true}
        handleClick={() => setDisplayForm((prev) => !prev)}
      />
      {displayForm && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="form-style">
            <CloseBtn handleClick={() => setDisplayForm(false)} />
            <h1 className="title-style text-white">
              {pageName.split(" ").slice(0, -1).join(" ")} Form
            </h1>
            <FormField
              control={form.control}
              name="pageTitle"
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
              name="pageContent"
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
            <FormBtn
              text={`${page?._id ? "Update" : "Create"} ${pageName}`}
              isSubmitting={form.formState.isSubmitting}
            />
          </form>
        </Form>
      )}
    </>
  );
};

export default PageForm;
