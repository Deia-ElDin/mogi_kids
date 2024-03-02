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
import { FileUploader } from "../helpers/FileUploader";
import { useUploadThing } from "@/lib/uploadthing";
import { handleError } from "@/lib/utils";
import { createRecord } from "@/lib/actions/record.actions";
import { recordSchema } from "@/lib/validators";
import { recordDefaultValues } from "@/constants";
import { useToast } from "@/components/ui/use-toast";
import AddBtn from "../btns/AddBtn";
import CloseBtn from "../btns/CloseBtn";
import FormBtn from "../btns/FormBtn";
import * as z from "zod";

const CreateRecordForm: React.FC = () => {
  const [displayForm, setDisplayForm] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("imageUploader");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof recordSchema>>({
    resolver: zodResolver(recordSchema),
    defaultValues: recordDefaultValues,
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

  async function onSubmit(values: z.infer<typeof recordSchema>) {
    try {
      let uploadedImgUrl = values.imgUrl;

      if (files.length === 0) return;

      const uploadedImgs = await startUpload(files);

      if (!uploadedImgs)
        throw new Error("Failed to upload the image to uploadthing database.");
      uploadedImgUrl = uploadedImgs[0].url;

      const { success, error } = await createRecord({
        ...values,
        imgUrl: uploadedImgUrl,
        imgSize: uploadedImgs[0].size,
      });

      if (!success && error) throw new Error(error);
      toast({ description: "Record Created Successfully." });
      handleClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Delete The Record, ${handleError(error)}`,
      });
    }
  }

  return (
    <>
      <AddBtn handleClick={() => setDisplayForm((prev) => !prev)} />
      {displayForm && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="form-style">
            <CloseBtn handleClick={() => setDisplayForm(false)} />
            <h1 className="title-style text-white">Record Form</h1>
            <FormField
              control={form.control}
              name="imgUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="label-style">SVG</FormLabel>
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
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="label-style">Record</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      className="edit-input-style text-style"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="label-style">Record Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="edit-input-style text-style"
                      placeholder="i.e. Clients, Staff Members, Google Rating etc."
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormBtn
              text="Create Record"
              isSubmitting={form.formState.isSubmitting}
            />
          </form>
        </Form>
      )}
    </>
  );
};

export default CreateRecordForm;
