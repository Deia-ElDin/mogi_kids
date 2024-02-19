"use client";

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
import { FileUploader } from "../helpers/FileUploader";
import { useUploadThing } from "@/lib/uploadthing";
import { isValidForm, handleError } from "@/lib/utils";
import { serviceSchema } from "@/lib/validators";
import { serviceDefaultValues } from "@/constants";
import { IService } from "@/lib/database/models/service.model";
import { createService, updateService } from "@/lib/actions/service.actions";
import AddBtn from "../btns/AddBtn";
import CloseBtn from "../btns/CloseBtn";
import FormBtn from "../btns/FormBtn";
import * as z from "zod";

type Props = {
  service: IService | null;
};

const ServiceForm: React.FC<Props> = ({ service }) => {
  const [displayForm, setDisplayForm] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("imageUploader");
  const pathname = usePathname();

  const form = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: serviceDefaultValues,
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

  async function onSubmit(values: z.infer<typeof serviceSchema>) {
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
      let uploadedImgUrl = values.imgUrl;

      if (files.length === 0) return;
      const uploadedImgs = await startUpload(files);

      if (!uploadedImgs) return;
      uploadedImgUrl = uploadedImgs[0].url;

      await createService({
        ...values,
        imgUrl: uploadedImgUrl,
        imgSize: uploadedImgs[0].size / 1000,
        path: pathname,
      });
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
            <CloseBtn handleClick={handleClose} />
            <h1 className="title-style text-white">Service Form</h1>
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
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="serviceName"
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
              name="serviceContent"
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
            <FormBtn
              text={`${service ? "Update" : "Create"} Service`}
              isSubmitting={form.formState.isSubmitting}
            />
          </form>
        </Form>
      )}
    </>
  );
};

export default ServiceForm;