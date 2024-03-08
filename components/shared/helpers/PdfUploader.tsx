"use client";

import { useCallback, Dispatch, SetStateAction } from "react";
import { useDropzone } from "@uploadthing/react/hooks";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { convertFileToUrl } from "@/lib/utils";
import { OurFileRouter } from "@/app/api/uploadthing/core";

type PdfUploaderProps = {
  imageUrl: string;
  onFieldChange: (value: string) => void;
  files: File[];
  setFiles: Dispatch<SetStateAction<File[]>>;
};

type TEndpoint = keyof OurFileRouter;

export function PdfUploader({
  files,
  imageUrl,
  onFieldChange,
  setFiles,
}: PdfUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    onFieldChange(convertFileToUrl(acceptedFiles[0]));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept([".pdf"]),
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-col items-center justify-center cursor-pointer"
    >
      <input {...getInputProps()} className="cursor-pointer" />
      <div className="border-2 rounded-lg bg-blue-500 p-2 text-white">
        {imageUrl ? `${files[0]?.name ?? "Invalid"}` : "Choose File"}
      </div>
      <p className="text-xs font-extralight">pdf (1MB)</p>
    </div>
  );
}
