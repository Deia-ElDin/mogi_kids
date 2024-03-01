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
import { FileUploader } from "../helpers/FileUploader";
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
import XBtn from "../btns/XBtn";
import Image from "next/image";
import GalleryImgCard from "../cards/GalleryCard";
import * as z from "zod";

type GalleryFormProps = {
  gallery: IGallery[] | [] | IGallery | null;
};

const GalleryForm: React.FC<GalleryFormProps> = ({ gallery }) => {
  const [displayForm, setDisplayForm] = useState<boolean>(true);
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
          description: `Gallery Image ${
            Array.isArray(gallery) && gallery.length > 0 ? "Updated" : "Created"
          } Successfully`,
        });

        if (success) handleClose();
        else if (error) throw new Error(error);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: handleError(error),
      });
    }
  }
  console.log("img = ", img);

  const ImgsList = () => (
    <div className="w-full my-5 p-2 border-4 border-gray-300 rounded-sm flex gap-5 overflow-x-auto">
      {Array.isArray(gallery) &&
        gallery.length > 0 &&
        gallery.map((galleryImg) => (
          <div
            key={galleryImg._id}
            className="h-[100px] w-[100px] rounded-sm relative"
          >
            <XBtn
              deletionTarget="image"
              handleClick={() => console.log("deleted")}
            />
            <Image
              src={galleryImg.imgUrl}
              alt="Gallery Image"
              height={100}
              width={100}
              className={`h-full w-full cursor-pointer border-4 ${
                img && img._id === galleryImg._id ? "border-green-700" : ""
              }`}
              onClick={() => setImg(galleryImg)}
            />
          </div>
        ))}
      <div className="h-[100px] w-[100px] rounded-sm">
        <Image
          src="/assets/icons/upload.svg"
          alt="Upload image"
          width={100}
          height={100}
          className={`cursor-pointer border-4 ${!img && "border-green-700"}`}
          onClick={() => setImg(null)}
        />
      </div>
    </div>
  );

  return (
    <>
      <UpdateBtn
        updateTarget={`${
          Array.isArray(gallery) && gallery.length > 0 ? "Update" : "Create"
        } Gallery`}
        handleClick={() => setDisplayForm((prev) => !prev)}
      />
      {displayForm && (
        <div className="w-full">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="form-style">
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
                      <FileUploader
                        imageUrl={field.value}
                        onFieldChange={field.onChange}
                        setFiles={setFiles}
                        imgClass="max-w-[500px] h-fit"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <ImgsList />
              <div className="w-full">
                <FormBtn
                  text={`${
                    Array.isArray(gallery) && gallery.length > 0
                      ? "Add to"
                      : "Create"
                  } gallery`}
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
