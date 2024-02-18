"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { IServicesPage } from "@/lib/database/models/servicesPage.model";
import { createService } from "@/lib/actions/services.actions";
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
import { handleError } from "@/lib/utils";
import { FileUploader } from "../helpers/FileUploader";
import { useUploadThing } from "@/lib/uploadthing";
import CloseBtn from "../btns/CloseBtn";
import AddBtn from "../btns/AddBtn";
import SubmittingBtn from "../btns/SubmittingBtn";
import FormBtn from "../btns/FormBtn";
import * as z from "zod";

type Props = {
  isAdmin: boolean;
  servicePage: IServicesPage;
};

const ServiceForm: React.FC<Props> = ({ isAdmin, servicePage }) => {
  if (!isAdmin || !servicePage) return null;

  const [displayForm, setDisplayForm] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("imageUploader");
  const pathname = usePathname();

  const form = useForm<z.infer<typeof addServiceSchema>>({
    resolver: zodResolver(addServiceSchema),
    defaultValues: addServiceDefaultValues,
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
            {form.formState.isSubmitting ? (
              <SubmittingBtn />
            ) : (
              <FormBtn text={`${servicePage ? "Update" : "Add"} Service`} />
            )}
          </form>
        </Form>
      )}
    </>
  );
};

export default ServiceForm;
