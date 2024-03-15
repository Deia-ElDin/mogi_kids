"use client";

import { useState, useEffect } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { ImgUploader } from "../helpers/ImgUploader";
import { useUploadThing } from "@/lib/uploadthing";
import { handleError } from "@/lib/utils";
import { contactSchema } from "@/lib/validators";
import { contactDefaultValues } from "@/constants";
import { createContact } from "@/lib/actions/contact.actions";
import AddBtn from "../btns/AddBtn";
import CloseBtn from "../btns/CloseBtn";
import FormBtn from "../btns/FormBtn";
import * as z from "zod";

const ContactForm: React.FC = () => {
  const [displayForm, setDisplayForm] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);

  const { startUpload } = useUploadThing("imageUploader");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof contactSchema>>({
    resolver: zodResolver(contactSchema),
    defaultValues: contactDefaultValues,
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
      const validationResult = contactSchema.safeParse(values);

      if (!validationResult.success)
        throw new Error(validationResult.error.message);

      let uploadedImgUrl = values.imgUrl;

      if (files.length === 0) return;

      const uploadedImgs = await startUpload(files);

      if (!uploadedImgs)
        throw new Error("Failed to upload the image to uploadthing database.");

      uploadedImgUrl = uploadedImgs[0].url;

      const { success, error } = await createContact({
        ...values,
        imgUrl: uploadedImgUrl,
        imgSize: uploadedImgs[0].size,
      });

      if (!success && error) {
        if (typeof error === "string") {
          throw new Error(error);
        } else {
          throw error;
        }
      }

      toast({ description: "Contact Created Successfully." });

      handleClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Create The Contact, ${handleError(error)}`,
      });
    }
  }

  return (
    <>
      <AddBtn handleClick={() => setDisplayForm((prev) => !prev)} />
      <div className="absolute bottom-[700px] left-0 right-0 w-full">
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
                      <ImgUploader
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
                text="Create Contact"
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
