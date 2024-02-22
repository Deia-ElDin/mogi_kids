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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader } from "../helpers/FileUploader";
import { useUploadThing } from "@/lib/uploadthing";
import { handleError } from "@/lib/utils";
import { serviceSchema } from "@/lib/validators";
import { serviceDefaultValues } from "@/constants";
import { IService } from "@/lib/database/models/service.model";
import { updateService } from "@/lib/actions/service.actions";
import EditBtn from "../btns/EditBtn";
import CloseBtn from "../btns/CloseBtn";
import FormBtn from "../btns/FormBtn";
import * as z from "zod";

type MiniServiceForm = {
  isAdmin: boolean | undefined;
  servicesPageId: string | undefined;
  service: IService;
};

const MiniServiceForm: React.FC<MiniServiceForm> = (props) => {
  const { isAdmin, servicesPageId, service } = props;

  if (!isAdmin || !servicesPageId) return null;

  const [displayForm, setDisplayForm] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const pathname = usePathname();
  const { startUpload } = useUploadThing("imageUploader");

  const form = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: service ? service : serviceDefaultValues,
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

  async function onSubmit(values: z.infer<typeof serviceSchema>) {
    try {
      let uploadedImgUrl = values.imgUrl;
      if (files.length > 0) {
        const uploadedImgs = await startUpload(files);

        if (!uploadedImgs) return;
        uploadedImgUrl = uploadedImgs[0].url;
        await updateService({
          ...values,
          _id: service._id,
          imgUrl: uploadedImgUrl,
          imgSize: uploadedImgs[0].size,
          newImg: true,
          path: pathname,
        });
      } else {
        await updateService({
          ...values,
          _id: service._id,
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
      <EditBtn
        centeredPosition={false}
        handleClick={() => setDisplayForm((prev) => !prev)}
      />
      {displayForm && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="form-style flex flex-col"
          >
            <CloseBtn handleClick={handleClose} />
            <Tabs defaultValue="image">
              <TabsList className="mobile-edit-tab">
                <TabsTrigger value="image" className="tab-trigger">
                  Image
                </TabsTrigger>
                <TabsTrigger value="text" className="tab-trigger">
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

export default MiniServiceForm;
