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
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { ImgUploader } from "../helpers/ImgUploader";
import { useUploadThing } from "@/lib/uploadthing";
import { handleError } from "@/lib/utils";
import { aboutUsSchema } from "@/lib/validators";
import { aboutUsDefaultValues } from "@/constants";
import { createAboutUs } from "@/lib/actions/aboutUs.actions";
import AddBtn from "../btns/AddBtn";
import CloseBtn from "../btns/CloseBtn";
import FormBtn from "../btns/FormBtn";
import * as z from "zod";

const CreateAboutUsForm: React.FC = () => {
  const [displayForm, setDisplayForm] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);

  const { startUpload } = useUploadThing("imageUploader");
  const { toast } = useToast();
  const pathname = usePathname();

  const form = useForm<z.infer<typeof aboutUsSchema>>({
    resolver: zodResolver(aboutUsSchema),
    defaultValues: aboutUsDefaultValues,
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

  async function onSubmit(values: z.infer<typeof aboutUsSchema>) {
    try {
      const validationResult = aboutUsSchema.safeParse(values);

      if (!validationResult.success)
        throw new Error(validationResult.error.message);

      let uploadedImgUrl = values.imgUrl;

      if (files.length === 0) return;
      const uploadedImgs = await startUpload(files);

      if (!uploadedImgs)
        throw new Error("Failed to upload the image to uploadthing database.");

      uploadedImgUrl = uploadedImgs[0].url;

      const { success, error } = await createAboutUs({
        ...values,
        imgUrl: uploadedImgUrl,
        imgSize: uploadedImgs[0].size,
        path: pathname,
      });

      if (!success && error) {
        if (typeof error === "string") {
          throw new Error(error);
        } else {
          throw error;
        }
      }

      toast({ description: "About Us Article Created Successfully." });

      handleClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Create The About Us Article, ${handleError(
          error
        )}`,
      });
    }
  }

  return (
    <>
      <AddBtn handleClick={() => setDisplayForm((prev) => !prev)} />
      {displayForm && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="form-style absolute bottom-0 left-0 right-0"
          >
            <CloseBtn handleClick={handleClose} />
            <h1 className="title-style text-white">AboutUs Form</h1>
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
                    <Input {...field} className="edit-input-style text-style" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imgUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="label-style">Image</FormLabel>
                  <FormControl>
                    <ImgUploader
                      imageUrl={field.value}
                      onFieldChange={field.onChange}
                      setFiles={setFiles}
                      imgClass="max-w-[300px] max-h-[300px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormBtn
              text="Create About Us Article"
              isSubmitting={form.formState.isSubmitting}
            />
          </form>
        </Form>
      )}
    </>
  );
};

export default CreateAboutUsForm;
