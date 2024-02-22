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
import { IRecord } from "@/lib/database/models/record.model";
import { updateRecord } from "@/lib/actions/record.actions";
import { recordSchema } from "@/lib/validators";
import { recordDefaultValues } from "@/constants";
import CloseBtn from "../btns/CloseBtn";
import FormBtn from "../btns/FormBtn";
import * as z from "zod";
import UpdateBtn from "../btns/UpdateBtn";

type MiniRecordFormProps = {
  record: IRecord;
};

const MiniRecordForm: React.FC<MiniRecordFormProps> = ({ record }) => {
  const [displayForm, setDisplayForm] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("imageUploader");

  const form = useForm<z.infer<typeof recordSchema>>({
    resolver: zodResolver(recordSchema),
    defaultValues: record ? record : recordDefaultValues,
  });

  useEffect(() => {
    form.reset(record ? record : recordDefaultValues);
  }, [record]);

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === "Escape") setDisplayForm(false);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  async function onSubmit(values: z.infer<typeof recordSchema>) {
    try {
      let uploadedImgUrl = values.imgUrl;

      if (files.length > 0) {
        const uploadedImgs = await startUpload(files);
        if (!uploadedImgs) return;
        uploadedImgUrl = uploadedImgs[0].url;

        await updateRecord({
          ...values,
          _id: record._id,
          imgUrl: uploadedImgUrl,
          imgSize: uploadedImgs[0].size,
          newImg: true,
        });
      } else {
        await updateRecord({
          ...values,
          _id: record._id,
          newImg: false,
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
        updateTarget="Edit Record"
        handleClick={() => setDisplayForm((prev) => !prev)}
      />
      {displayForm && (
        <div className="w-full absolute left-0 right-0">
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
                text={`${record?._id ? "Edit" : "Create"} Record`}
                isSubmitting={form.formState.isSubmitting}
              />
            </form>
          </Form>
        </div>
      )}
    </>
  );
};

export default MiniRecordForm;
