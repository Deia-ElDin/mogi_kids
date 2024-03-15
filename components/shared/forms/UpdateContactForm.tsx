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
import { IContact } from "@/lib/database/models/contact.model";
import { updateContact } from "@/lib/actions/contact.actions";
import UpdateBtn from "../btns/UpdateBtn";
import CloseBtn from "../btns/CloseBtn";
import FormBtn from "../btns/FormBtn";
import * as z from "zod";

type UpdateContactFormProps = {
  contact: IContact;
};

const UpdateContactForm: React.FC<UpdateContactFormProps> = ({ contact }) => {
  const [displayForm, setDisplayForm] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);

  const { startUpload } = useUploadThing("imageUploader");
  const { toast } = useToast();

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

  useEffect(() => {
    form.reset(contact ? contact : contactDefaultValues);
  }, [contact]);

  async function onSubmit(values: z.infer<typeof contactSchema>) {
    try {
      const validationResult = contactSchema.safeParse(values);

      if (!validationResult.success)
        throw new Error(validationResult.error.message);

      let uploadedImgUrl = values.imgUrl;

      if (files.length > 0) {
        const uploadedImgs = await startUpload(files);

        if (!uploadedImgs)
          throw new Error(
            "Failed to upload the image to uploadthing database."
          );

        uploadedImgUrl = uploadedImgs[0].url;

        const { success, error } = await updateContact({
          ...values,
          _id: contact._id,
          imgUrl: uploadedImgUrl,
          imgSize: uploadedImgs[0].size,
          newImg: true,
        });

        if (!success && error) {
          if (typeof error === "string") {
            throw new Error(error);
          } else {
            throw error;
          }
        }

        toast({ description: "Contact Updated Successfully." });

        handleClose();
      } else {
        const { success, error } = await updateContact({
          ...values,
          _id: contact._id,
          newImg: false,
        });

        if (!success && error) {
          if (typeof error === "string") {
            throw new Error(error);
          } else {
            throw error;
          }
        }

        toast({ description: "Contact Updated Successfully." });

        handleClose();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Update The Contact, ${handleError(error)}`,
      });
    }
  }

  return (
    <>
      <UpdateBtn
        updateTarget="Update Contact"
        handleClick={() => setDisplayForm((prev) => !prev)}
      />
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
                text="Update Contact"
                isSubmitting={form.formState.isSubmitting}
              />
            </form>
          </Form>
        )}
      </div>
    </>
  );
};

export default UpdateContactForm;
