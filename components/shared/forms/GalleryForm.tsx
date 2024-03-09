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
import { useToast } from "@/components/ui/use-toast";
import { ImgUploader } from "../helpers/ImgUploader";
import { useUploadThing } from "@/lib/uploadthing";
import { handleError } from "@/lib/utils";
import { gallerySchema } from "@/lib/validators";
import { galleryDefaultValues } from "@/constants";
import { IGallery } from "@/lib/database/models/gallery.model";
import {
  createGalleryImg,
  updateGalleryImg,
} from "@/lib/actions/gallery.actions";
import UpdateBtn from "../btns/UpdateBtn";
import CloseBtn from "../btns/CloseBtn";
import FormBtn from "../btns/FormBtn";
import GalleryImgCard from "../cards/GalleryImgCard";
import * as z from "zod";

type GalleryFormProps = {
  gallery: IGallery[] | [];
};

const GalleryForm: React.FC<GalleryFormProps> = ({ gallery }) => {
  const [displayForm, setDisplayForm] = useState<boolean>(false);
  const [files, setFiles] = useState<File[]>([]);
  const [img, setImg] = useState<IGallery | null>(null);

  const { startUpload } = useUploadThing("imageUploader");
  const { toast } = useToast();

  const form = useForm<z.infer<typeof gallerySchema>>({
    resolver: zodResolver(gallerySchema),
    defaultValues: img ? img : galleryDefaultValues,
  });

  const handleClose = () => {
    form.reset();
    setFiles([]);
    setImg(null);
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
    form.reset(img ? img : galleryDefaultValues);
  }, [img]);

  async function onSubmit(values: z.infer<typeof gallerySchema>) {
    let uploadedImgUrl = values.imgUrl;

    try {
      const validationResult = gallerySchema.safeParse(values);

      if (!validationResult.success)
        throw new Error(validationResult.error.message);

      if (files.length > 0) {
        const uploadedImgs = await startUpload(files);

        if (!uploadedImgs)
          throw new Error("Failed to add the image to uploadthing database.");

        uploadedImgUrl = uploadedImgs[0].url;

        const { success, error } = img?._id
          ? await updateGalleryImg({
              _id: img?._id,
              imgUrl: uploadedImgUrl,
              imgSize: uploadedImgs[0].size,
            })
          : await createGalleryImg({
              imgUrl: uploadedImgUrl,
              imgSize: uploadedImgs[0].size,
            });

        toast({
          description: `Gallery ${
            gallery.length > 0 ? "Updated" : "Created"
          } Successfully`,
        });

        if (success) handleClose();
        else if (error) throw new Error(error);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Failed to Create The Gallery Image, ${handleError(
          error
        )}`,
      });
    }
  }

  const ImgsList = () => (
    <div className="w-full my-5 p-2 border-4 border-gray-300 rounded-sm flex gap-5 overflow-x-auto relative">
      <div className="static">
        <GalleryImgCard galleryImg={null} img={img} setImg={setImg} />
      </div>
      {gallery.length > 0 &&
        gallery.map((galleryImg) => (
          <GalleryImgCard
            key={galleryImg._id}
            galleryImg={galleryImg}
            img={img}
            setImg={setImg}
          />
        ))}
    </div>
  );

  return (
    <>
      <UpdateBtn
        updateTarget="Gallery"
        handleClick={() => setDisplayForm((prev) => !prev)}
      />
      {displayForm && (
        <div className="w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="form-style absolute left-0 right-0"
            >
              <CloseBtn handleClick={handleClose} />
              <h1 className="title-style text-white">Gallery Form</h1>
              <FormField
                control={form.control}
                name="imgUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="label-style">
                      Gallery Image/s
                    </FormLabel>
                    <FormControl>
                      <ImgUploader
                        imageUrl={field.value}
                        onFieldChange={field.onChange}
                        setFiles={setFiles}
                        imgClass="max-w-[500px] max-h-[500px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <ImgsList />
              <div className="w-full">
                <FormBtn
                  text={
                    img
                      ? "Change Image"
                      : (gallery.length > 0 ? "Add to" : "Create") + " Gallery"
                  }
                  isSubmitting={form.formState.isSubmitting}
                />
              </div>
            </form>
          </Form>
        </div>
      )}
    </>
  );
};

export default GalleryForm;
