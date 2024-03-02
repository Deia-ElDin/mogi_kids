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
import { FileUploader } from "../helpers/FileUploader";
import { useUploadThing } from "@/lib/uploadthing";
import {  handleError } from "@/lib/utils";
import { contactSchema } from "@/lib/validators";
import { contactDefaultValues } from "@/constants";
import { IContact } from "@/lib/database/models/contact.model";
import { createContact } from "@/lib/actions/contact.actions";
import AddBtn from "../btns/AddBtn";
import CloseBtn from "../btns/CloseBtn";
import FormBtn from "../btns/FormBtn";
import * as z from "zod";

type ContactProps = {
  contact: IContact | null;
};

const ContactForm: React.FC<ContactProps> = ({ contact }) => {
  const [displayForm, setDisplayForm] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const pathname = usePathname();
  const { startUpload } = useUploadThing("imageUploader");

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: contact ? contact : contactDefaultValues,
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

  async function onSubmit(values: z.infer<typeof contactSchema>) {
    try {
      let uploadedImgUrl = values.imgUrl;

      if (files.length === 0) return;
      const uploadedImgs = await startUpload(files);

      if (!uploadedImgs)
        throw new Error("Failed to upload the image to uploadthing database.");
      uploadedImgUrl = uploadedImgs[0].url;

      await createContact({
        ...values,
        imgUrl: uploadedImgUrl,
        imgSize: uploadedImgs[0].size,
      });
      setDisplayForm(false);
      form.reset();
    } catch (error) {
      handleError(error);
    }
  }

  return (
    <>
      {!contact && (
        <AddBtn handleClick={() => setDisplayForm((prev) => !prev)} />
      )}
      <div className="absolute bottom-[700px] w-full">
        {displayForm && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="form-style">
              <CloseBtn handleClick={handleClose} />
              <h1 className="title-style text-white">Contact Form</h1>
              <FormField
                control={form.control}
                name="imgUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="label-style">Contact Icon</FormLabel>
                    <FormControl>
                      <FileUploader
                        imageUrl={field.value}
                        onFieldChange={field.onChange}
                        setFiles={setFiles}
                        imgClass="max-w-[100px] max-h-[100px]"
                      />
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
                    <FormLabel className="label-style">
                      Contact Content
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="edit-input-style text-style"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormBtn
                text={`${contact ? "Update" : "Create"} Contact`}
                isSubmitting={form.formState.isSubmitting}
              />
            </form>
          </Form>
        )}
      </div>
    </>
  );
};

export default ContactForm;
