"use client";

import { useCallback, Dispatch, SetStateAction } from "react";
import { useDropzone } from "@uploadthing/react/hooks";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { convertFileToUrl } from "@/lib/utils";

type ImgUploaderProps = {
  imageUrl: string;
  onFieldChange: (value: string) => void;
  setFiles: Dispatch<SetStateAction<File[]>>;
  imgClass?: string;
};

export function ImgUploader({
  imageUrl,
  onFieldChange,
  setFiles,
  imgClass,
}: ImgUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    onFieldChange(convertFileToUrl(acceptedFiles[0]));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*" ? generateClientDropzoneAccept(["image/*"]) : undefined,
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-col items-center justify-center cursor-pointer"
    >
      <input {...getInputProps()} className="cursor-pointer" />
      {imageUrl ? (
        <div className="flex h-full w-full flex-1 justify-center">
          <img src={imageUrl} alt="Service image" className={imgClass} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <img
            src="/assets/icons/upload.svg"
            alt="Upload image"
            width={150}
            height={150}
          />
          <p className="mb-2 mt-2 text-white">
            Click or drag & drop photo here (SVG, PNG, JPG, JPEG)
          </p>
        </div>
      )}
    </div>
  );
}
