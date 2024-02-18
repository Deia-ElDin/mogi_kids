"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { IServicesPage } from "@/lib/database/models/servicesPage.model";
import {
  createServicePage,
  updateServicePage,
} from "@/lib/actions/services.actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { servicePageSchema } from "@/lib/validators";
import { serviceDefaultValues } from "@/constants";
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
import FormBtn from "../btns/FormBtn";
import SubmittingBtn from "../btns/SubmittingBtn";
import * as z from "zod";
// import FileUploader from "../helpers/FileUploader";

type Props = {
  isAdmin: boolean;
  servicePage: IServicesPage | null;
};

const ServicesPageForm: React.FC<Props> = ({ isAdmin, servicePage }) => {
  if (!isAdmin) return;

  const [displayForm, setDisplayForm] = useState<boolean>(false);
  const pathname = usePathname();

  const initValues = servicePage ? servicePage : serviceDefaultValues;

  const form = useForm<z.infer<typeof servicePageSchema>>({
    resolver: zodResolver(servicePageSchema),
    defaultValues: initValues,
  });

  useEffect(() => {
    form.reset(servicePage ? servicePage : serviceDefaultValues);
  }, [servicePage]);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape") setDisplayForm(false);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  async function onSubmit(values: z.infer<typeof servicePageSchema>) {
    // if (!isValidForm(values)) return;

    try {
      if (servicePage) {
        await updateServicePage({
          ...values,
          _id: servicePage._id,
          path: pathname,
        });
      } else await createServicePage({ ...values, path: pathname });
      setDisplayForm(false);
      form.reset();
    } catch (error) {
      handleError(error);
    }
  }

  return (
    <>
      <EditBtn
        centeredPosition={servicePage ? false : true}
        handleClick={() => setDisplayForm((prev) => !prev)}
      />
      {displayForm && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="edit-form-style"
          >
            <CloseBtn handleClick={() => setDisplayForm(false)} />
            <h1 className="title-style text-white">Service Page</h1>
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
            {form.formState.isSubmitting ? (
              <SubmittingBtn />
            ) : (
              <FormBtn
                text={`${servicePage ? "Update" : "Create"} Service Page`}
              />
            )}
          </form>
        </Form>
      )}
    </>
  );
};

export default ServicesPageForm;
