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
import { FileUploader } from "../helpers/FileUploader";
import { useUploadThing } from "@/lib/uploadthing";
import { handleError } from "@/lib/utils";
import { aboutUsSchema } from "@/lib/validators";
import { aboutUsDefaultValues } from "@/constants";
import { IAboutUs } from "@/lib/database/models/about-us.model";
import { updateAboutUs } from "@/lib/actions/aboutUs.actions";
import UpdateBtn from "../btns/UpdateBtn";
import CloseBtn from "../btns/CloseBtn";
import FormBtn from "../btns/FormBtn";
import * as z from "zod";

type UpdateAboutUsFormProps = {
  aboutUsArticle: IAboutUs;
};

const UpdateAboutUsForm: React.FC<UpdateAboutUsFormProps> = ({
  aboutUsArticle,
}) => {
  const [displayForm, setDisplayForm] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);

  const { startUpload } = useUploadThing("imageUploader");
  const { toast } = useToast();

  const pathname = usePathname();

  const form = useForm<z.infer<typeof aboutUsSchema>>({
    resolver: zodResolver(aboutUsSchema),
    defaultValues: aboutUsArticle ? aboutUsArticle : aboutUsDefaultValues,
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
      let uploadedImgUrl = values.imgUrl;

      if (files.length > 0) {
        const uploadedImgs = await startUpload(files);
        if (!uploadedImgs)
          throw new Error(
            "Failed to upload the image to uploadthing database."
          );
        uploadedImgUrl = uploadedImgs[0].url;

        const { success, error } = await updateAboutUs({
          ...values,
          _id: aboutUsArticle._id,
          imgUrl: uploadedImgUrl,
          imgSize: uploadedImgs[0].size,
          newImg: true,
          path: pathname,
        });

        if (!success && error) throw new Error(error);

        toast({ description: "About Us Article Updated Successfully." });

        handleClose();
      } else {
        const { success, error } = await updateAboutUs({
          ...values,
          _id: aboutUsArticle._id,
          newImg: false,
          path: pathname,
        });

        if (!success && error) throw new Error(error);

        toast({ description: "About Us Article Updated Successfully." });

        handleClose();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Update The About Us Article, ${handleError(
          error
        )}`,
      });
    }
  }

  return (
    <>
      <UpdateBtn
        updateTarget="Update Article"
        handleClick={() => setDisplayForm((prev) => !prev)}
      />
      {displayForm && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="form-style absolute bottom-0 left-0 right-0 w-full"
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
                    <FileUploader
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
              text={`${aboutUsArticle ? "Update" : "Create"} About Us Article`}
              isSubmitting={form.formState.isSubmitting}
            />
          </form>
        </Form>
      )}
    </>
  );
};

export default UpdateAboutUsForm;
