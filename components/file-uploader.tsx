"use client";

import { X, UploadCloud, Upload, Loader2 } from "lucide-react";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { UploadClient } from "@uploadcare/upload-client";
import { cn } from "@/lib/utils";

interface PropTypes {
  value: string;
  onChange: (url?: string) => void;
  isLoading: boolean;
}

const client = new UploadClient({ publicKey: process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY as string });

export const FileUploader = ({ onChange, value, isLoading: isSubmitting }: PropTypes) => {
  const [uploadIsFinished, setUploadIsFinished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const uploadRef = useRef<any>(null);

  useEffect(() => {
    if (value) setUploadIsFinished(true);
  }, [value]);

  const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    setUploadIsFinished(false);

    const file = (e.target as HTMLInputElement).files![0];
    if (!file) return;

    try {
      setIsLoading(true);

      const uploadCareFile = await client.uploadFile(file);
      onChange(uploadCareFile.cdnUrl as string);
      setUploadIsFinished(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (value && uploadIsFinished) {
    return (
      <div className={cn("relative h-20 w-20", isSubmitting && "image-overlay-wrapper")}>
        <img src={value} alt="Upload" className="rounded-full bg-gray-500 h-full w-full" />
        <button
          type="button"
          className="absolute top-0 right-0 bg-rose-500 rounded-full p-1 hover:bg-rose-400 shadow-sm disabled:bg-rose-300 z-50"
          onClick={() => onChange("")}
          disabled={isSubmitting}>
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      onClick={() => uploadRef?.current?.click()}
      className={cn(
        "flex flex-col items-center cursor-pointer justify-center gap-y-2 py-10 px-20 rounded-lg border border-dotted border-gray-500",
        isLoading && "cursor-not-allowed bg-gray-100"
      )}>
      {isLoading ? (
        <Loader2 className="h-6 w-6 animate-spin mb-2" />
      ) : (
        <>
          <UploadCloud className="h-10 w-10" />
          <p className="text-sm sm:text-base text-blue-500 font-bold cursor-pointer dark:hover:text-blue-400 hover:text-blue-600 transition">
            Upload community image
          </p>
        </>
      )}

      <div
        className={cn(
          "flex items-center gap-x-2 px-4 py-2 rounded-md text-sm bg-gray-100 hover:bg-gray-200 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-white transition",
          isLoading && "hidden"
        )}>
        <Upload className="h-4 w-4" />
        <button type="button" className="font-[400] text-zinc-700 dark:text-white">
          Upload file
        </button>
      </div>

      <input type="file" ref={uploadRef} onChange={(e) => uploadFile(e)} className="hidden" />
    </div>
  );
};
