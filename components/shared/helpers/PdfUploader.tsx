"use client";

import { useCallback, Dispatch, SetStateAction } from "react";
import { useDropzone } from "@uploadthing/react/hooks";
import { UploadButton } from "@uploadthing/react";
import { generateClientDropzoneAccept } from "uploadthing/client";
import { convertFileToUrl } from "@/lib/utils";
import { OurFileRouter } from "@/app/api/uploadthing/core";

type PdfUploaderProps = {
  imageUrl: string;
  onFieldChange: (value: string) => void;
  setFiles: Dispatch<SetStateAction<File[]>>;
  imgClass?: string;
};

type TEndpoint = keyof OurFileRouter;

export function PdfUploader({
  imageUrl,
  onFieldChange,
  setFiles,
  imgClass,
}: PdfUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    onFieldChange(convertFileToUrl(acceptedFiles[0]));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: generateClientDropzoneAccept([".pdf", ".doc", ".docx"]),
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
          <UploadButton<OurFileRouter, TEndpoint> endpoint="pdfUploader" />
        </div>
      )}
    </div>
  );
}
