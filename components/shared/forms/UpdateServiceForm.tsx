"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { Textarea } from "@/components/ui/textarea";
import { ImgUploader } from "../helpers/ImgUploader";
import { useUploadThing } from "@/lib/uploadthing";
import { serviceSchema } from "@/lib/validators";
import { serviceDefaultValues } from "@/constants";
import { IService } from "@/lib/database/models/service.model";
import { updateService } from "@/lib/actions/service.actions";
import { handleError } from "@/lib/utils";
import EditBtn from "../btns/EditBtn";
import CloseBtn from "../btns/CloseBtn";
import FormBtn from "../btns/FormBtn";
import * as z from "zod";

type UpdateServiceFormProps = {
  service: IService;
};

const UpdateServiceForm: React.FC<UpdateServiceFormProps> = ({ service }) => {
  const [displayForm, setDisplayForm] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("imageUploader");
  const { toast } = useToast();
  const pathname = usePathname();

  const form = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service ? service : serviceDefaultValues,
  });

  const handleClose = () => {
    form.reset(service);
    setFiles([]);
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
    form.reset(service ? service : serviceDefaultValues);
  }, [service]);

  async function onSubmit(values: z.infer<typeof serviceSchema>) {
    try {
      const validationResult = serviceSchema.safeParse(values);

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

        const { success, error } = await updateService({
          ...values,
          _id: service._id,
          imgUrl: uploadedImgUrl,
          imgSize: uploadedImgs[0].size,
          newImg: true,
          path: pathname,
        });

        if (!success && error) {
          if (typeof error === "string") {
            throw new Error(error);
          } else {
            throw error;
          }
        }
        toast({ description: "Service Updated Successfully." });
        handleClose();
      } else {
        const { success, error } = await updateService({
          ...values,
          _id: service._id,
          newImg: false,
          path: pathname,
        });

        if (!success && error) {
          if (typeof error === "string") {
            throw new Error(error);
          } else {
            throw error;
          }
        }
        toast({ description: "Service Updated Successfully." });
        handleClose();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Update The Service, ${handleError(error)}`,
      });
    }
  }

  return (
    <>
      <EditBtn
        centeredPosition={false}
        handleClick={() => setDisplayForm((prev) => !prev)}
      />
      {displayForm && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="form-style">
            <CloseBtn handleClick={handleClose} />
            <Tabs defaultValue="image">
              <TabsList className="mobile-edit-tab">
                <TabsTrigger
                  value="image"
                  className="label-style flex-1 text-center text-white cursor-pointer"
                >
                  Image
                </TabsTrigger>
                <TabsTrigger
                  value="text"
                  className="label-style flex-1 text-center text-white cursor-pointer"
                >
                  Text
                </TabsTrigger>
              </TabsList>
              <TabsContent value="image" className="tab-content">
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
              </TabsContent>
              <TabsContent value="text">
                <FormField
                  control={form.control}
                  name="serviceName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="label-style">
                        Service Title
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
                <FormField
                  control={form.control}
                  name="serviceContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="label-style">
                        Service Content
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="mobile-edit-textarea-style text-style"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
            </Tabs>
            <FormBtn
              text="Update Service"
              isSubmitting={form.formState.isSubmitting}
            />
          </form>
        </Form>
      )}
    </>
  );
};

export default UpdateServiceForm;
