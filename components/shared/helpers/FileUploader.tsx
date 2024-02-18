"use client";

import { useCallback, Dispatch, SetStateAction } from "react";
import { useDropzone } from "@uploadthing/react/hooks";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { convertFileToUrl } from "@/lib/utils";
import Image from "next/image";

type FileUploaderProps = {
  imageUrl: string;
  onFieldChange: (value: string) => void;
  setFiles: Dispatch<SetStateAction<File[]>>;
};

export function FileUploader({
  imageUrl,
  onFieldChange,
  setFiles,
}: FileUploaderProps) {
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
        <div className="flex h-full w-full flex-1 justify-center border-2 border-white">
          <Image
            src={imageUrl}
            alt="Service image"
            width={300}
            height={300}
            className="w-full object-cover object-center"
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <Image
            src="/assets/icons/upload.svg"
            alt="Upload button"
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
