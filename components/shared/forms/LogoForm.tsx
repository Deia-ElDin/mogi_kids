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
import { FileUploader } from "../helpers/FileUploader";
import { useUploadThing } from "@/lib/uploadthing";
import { handleError } from "@/lib/utils";
import { logoSchema } from "@/lib/validators";
import { logoDefaultValues } from "@/constants";
import { ILogo } from "@/lib/database/models/logo.model";
import { createLogo, updateLogo } from "@/lib/actions/logo.actions";
import UpdateBtn from "../btns/UpdateBtn";
import CloseBtn from "../btns/CloseBtn";
import FormBtn from "../btns/FormBtn";
import * as z from "zod";

type logoProps = {
  logo: ILogo | null;
};

const logoForm: React.FC<logoProps> = ({ logo }) => {
  const [displayForm, setDisplayForm] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("imageUploader");

  const form = useForm<z.infer<typeof logoSchema>>({
    resolver: zodResolver(logoSchema),
    defaultValues: logo ? logo : logoDefaultValues,
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

  async function onSubmit(values: z.infer<typeof logoSchema>) {
    let uploadedImgUrl = values.imgUrl;

    if (files.length > 0) {
      const uploadedImgs = await startUpload(files);
      if (!uploadedImgs) return;
      uploadedImgUrl = uploadedImgs[0].url;

      if (logo?._id) {
        await updateLogo({
          _id: logo._id,
          imgUrl: uploadedImgUrl,
          imgSize: uploadedImgs[0].size,
        });
      } else {
        await createLogo({
          imgUrl: uploadedImgUrl,
          imgSize: uploadedImgs[0].size,
        });
      }
      setFiles([]);
      setDisplayForm(false);
    }
  }

  return (
    <>
      <UpdateBtn
        updateTarget={`${logo?._id ? "Update" : "Create"} Logo`}
        handleClick={() => setDisplayForm((prev) => !prev)}
      />
      <div className="w-full">
        {displayForm && (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="form-style">
              <CloseBtn handleClick={handleClose} />
              <h1 className="title-style text-white">logo Form</h1>
              <FormField
                control={form.control}
                name="imgUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="label-style">logo Icon</FormLabel>
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
              <FormBtn
                text={`${logo ? "Update" : "Create"} logo`}
                isSubmitting={form.formState.isSubmitting}
              />
            </form>
          </Form>
        )}
      </div>
    </>
  );
};

export default logoForm;
