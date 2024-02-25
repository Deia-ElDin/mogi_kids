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
import { handleError } from "@/lib/utils";
import { aboutUsSchema } from "@/lib/validators";
import { aboutUsDefaultValues } from "@/constants";
import { IAboutUs } from "@/lib/database/models/about-us.model";
import { updateAboutUs } from "@/lib/actions/aboutUs.actions";
import UpdateBtn from "../btns/UpdateBtn";
import CloseBtn from "../btns/CloseBtn";
import FormBtn from "../btns/FormBtn";
import * as z from "zod";

type MiniAboutUsFormProps = {
  aboutUsArticle: IAboutUs;
};

const MiniAboutUsForm: React.FC<MiniAboutUsFormProps> = ({
  aboutUsArticle,
}) => {
  const [displayForm, setDisplayForm] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const pathname = usePathname();
  const { startUpload } = useUploadThing("imageUploader");

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
        if (!uploadedImgs) return;
        uploadedImgUrl = uploadedImgs[0].url;

        await updateAboutUs({
          ...values,
          _id: aboutUsArticle._id,
          imgUrl: uploadedImgUrl,
          imgSize: uploadedImgs[0].size,
          newImg: true,
          path: pathname,
        });
      } else {
        await updateAboutUs({
          ...values,
          _id: aboutUsArticle._id,
          newImg: false,
          path: pathname,
        });
      }

      setDisplayForm(false);
      form.reset();
    } catch (error) {
      handleError(error);
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
            className="form-style absolute bottom-0 w-full"
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

export default MiniAboutUsForm;
