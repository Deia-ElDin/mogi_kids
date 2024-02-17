"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { IServicesPage } from "@/lib/database/models/services.model";
import { createService } from "@/lib/actions/service.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { addServiceSchema } from "@/lib/validators";
import { addServiceDefaultValues } from "@/constants";
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
import CloseBtn from "../btns/CloseBtn";
import * as z from "zod";
import { FileUploader } from "../helpers/FileUploader";
import AddBtn from "../btns/AddBtn";

type AddServiceFormProps = {
  isAdmin: boolean;
  servicePage?: IServicesPage | null;
};

const AddServiceForm = ({ isAdmin, servicePage }: AddServiceFormProps) => {
  const [displayForm, setDisplayForm] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);

  const pathname = usePathname();
  const initValues = servicePage ? servicePage : addServiceDefaultValues;

  const form = useForm<z.infer<typeof addServiceSchema>>({
    resolver: zodResolver(addServiceSchema),
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

  async function onSubmit(values: z.infer<typeof addServiceSchema>) {
    // if (!isValidForm(values)) return;
    try {
      // if (servicePage) {
      //   await updateServicePage({
      //     ...values,
      //     _id: servicePage._id,
      //     path: pathname,
      //   });
      // } else await createServicePage({ ...values, path: pathname });

      // await createServicePage({ ...values, path: pathname });
      await createService({ ...values, path: pathname });
      setDisplayForm(false);
      form.reset();
    } catch (error) {
      handleError(error);
    }
  }

  return (
    <>
      <AddBtn
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
            <h1 className="title-style text-white">Add Service</h1>
            <FormField
              control={form.control}
              name="imgUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="label-style">Image</FormLabel>
                  <FormControl>
                    <FileUploader
                      imageUrl={field.value}
                      onFieldChange={field.onChange}
                      setFiles={setFiles}
                    />
                    <Input {...field} className="edit-input-style text-style" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="service"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="label-style">Service Title</FormLabel>
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
                  <FormLabel className="label-style">Service Content</FormLabel>
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
            <div className="w-full flex justify-center md:col-span-2">
              <Button type="submit" className="form-btn label-style">
                {servicePage ? "Update" : "Add"} Service
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
};

export default AddServiceForm;
