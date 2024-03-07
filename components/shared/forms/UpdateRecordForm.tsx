"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ImgUploader } from "../helpers/ImgUploader";
import { useUploadThing } from "@/lib/uploadthing";
import { handleError } from "@/lib/utils";
import { IRecord } from "@/lib/database/models/record.model";
import { updateRecord } from "@/lib/actions/record.actions";
import { recordSchema } from "@/lib/validators";
import { recordDefaultValues } from "@/constants";
import UpdateBtn from "../btns/UpdateBtn";
import CloseBtn from "../btns/CloseBtn";
import FormBtn from "../btns/FormBtn";
import * as z from "zod";

type UpdateRecordFormProps = {
  record: IRecord;
};

const UpdateRecordForm: React.FC<UpdateRecordFormProps> = ({ record }) => {
  const [displayForm, setDisplayForm] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("imageUploader");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof recordSchema>>({
    resolver: zodResolver(recordSchema),
    defaultValues: record ? record : recordDefaultValues,
  });

  const handleClose = () => {
    form.reset(record);
    setDisplayForm(false);
  };

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

        if (!uploadedImgs)
          throw new Error(
            "Failed to upload the image to uploadthing database."
          );

        uploadedImgUrl = uploadedImgs[0].url;

        const { success, error } = await updateRecord({
          ...values,
          _id: record._id,
          imgUrl: uploadedImgUrl,
          imgSize: uploadedImgs[0].size,
          newImg: true,
        });

        if (!success && error) throw new Error(error);
        toast({ description: "Record Updated Successfully." });
        handleClose();
      } else {
        const { success, error } = await updateRecord({
          ...values,
          _id: record._id,
          newImg: false,
        });

        if (!success && error) throw new Error(error);
        toast({ description: "Record Updated Successfully." });
        handleClose();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Update The Record, ${handleError(error)}`,
      });
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
                text="Update Record"
                isSubmitting={form.formState.isSubmitting}
              />
            </form>
          </Form>
        </div>
      )}
    </>
  );
};

export default UpdateRecordForm;
