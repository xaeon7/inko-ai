"use client";

import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "@/components/icons/plus";
import { CloudUpload } from "@/components/icons/cloud-upload";
import { useDropzone } from "react-dropzone";
import { cn, cutString } from "@/lib/utils";
import { uploadToS3 } from "@/lib/s3";
import newToast from "@/lib/toast";
import { Document } from "@/components/icons/document";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Loader } from "./icons/loader";
import { SolidCheck } from "./icons/check";
import { useRouter } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const MAX_SIZE = 20;

export default function UploadDialog() {
  const [file, setFile] = React.useState<File | null>(null);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isCreating, setIsCreating] = React.useState(false);
  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: async ({
      file_key,
      file_name,
    }: {
      file_key: string;
      file_name: string;
    }) => {
      const response = await axios.post<{ chat_id: string }>("/api/chats", {
        file_key,
        file_name,
      });

      return response.data;
    },
    onMutate: () => {
      setIsCreating(true);
    },
  });

  const progressRef = React.useRef<HTMLSpanElement>(null);
  const progressBarRef = React.useRef<HTMLDivElement>(null);

  function updateUploadProgress(progress: number) {
    if (progressRef.current) {
      progressRef.current.innerText = progress.toString();
    }
    if (progressBarRef.current) {
      progressBarRef.current.style.width = `${progress}%`;
    }
  }

  async function handleOnDropAccepted(acceptedFiles: File[]) {
    const file = acceptedFiles[0];
    if (file.size > MAX_SIZE * 1024 * 1024) {
      newToast("The file is too large", "error");
      return;
    }

    try {
      setFile(file);
      setIsUploading(true);
      const data = await uploadToS3(file, updateUploadProgress);

      if (!data?.file_key || !data.file_name) {
        newToast(`${cutString(file.name, 15)} is not uploaded.`);
        return;
      }

      mutate(data, {
        onSuccess: (data) => {
          newToast(`Chat created successfully`);
          router.push(`/chat/${data.chat_id}`);
        },
        onError: (_) => {
          newToast("Error creating chat", "error");
        },
        onSettled: () => {
          setIsCreating(false);
        },
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  }

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      accept: { "application/pdf": [".pdf"] },
      maxFiles: 1,
      multiple: false,
      onDropAccepted: (acceptedFiles) => {
        void handleOnDropAccepted(acceptedFiles);
      },
    });
  return (
    <Dialog onOpenChange={(open) => open && setFile(null)}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <button
                className="bg-main text-neutral-900 rounded-lg w-8 h-8 grid place-content-center border border-transparent duration-200 hover:bg-opacity-95 hover:shadow-lg hover:shadow-main disabled:opacity-50 disabled:pointer-events-none"
                disabled={isUploading || isCreating}
              >
                {isUploading || isCreating ? (
                  <Loader className="animate-spin w-4 h-4" />
                ) : (
                  <Plus />
                )}
              </button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {isUploading
                ? "Uploading document..."
                : isCreating
                ? "Creating chat..."
                : "Create new chat"}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <DialogContent className="sm:max-w-md flex flex-col gap-8">
        <DialogHeader>
          <DialogTitle className="text-lg">Create new chat</DialogTitle>
        </DialogHeader>

        {file ? (
          <div className="flex flex-col gap-3 border border-neutral-600 p-3 rounded-lg">
            <div className="flex justify-between items-center">
              {/* File info */}
              <div className="flex gap-2 items-center">
                <Document />
                <span>{cutString(file.name, 20)}</span>
                <span className="text-neutral-400 text-sm">
                  {Math.floor((file.size / 1024 / 1024) * 1000) / 1000} mb
                </span>
              </div>

              {/* File progress */}
              <div className="text-neutral-200 text-sm flex items-center">
                {progressRef.current?.innerText === "100" ? (
                  <SolidCheck className="rounded-full text-main w-3 h-3 mr-1" />
                ) : null}
                <span ref={progressRef}>0</span>%
              </div>
            </div>

            {/* Progress bar */}
            <div className="w-full bg-neutral-600/50 rounded-full h-1.5 mb-4">
              <div
                className="bg-main h-1.5 rounded-full w-0 transition-all"
                ref={progressBarRef}
              />
            </div>
          </div>
        ) : (
          <div
            {...getRootProps({
              className: cn(
                "flex items-center flex-col border-dashed border-neutral-600 border rounded-xl p-8 gap-2 cursor-pointer duration-150 hover:bg-neutral-800",
                {
                  "bg-main/30 border-main border-solid cursor-grabbing":
                    isDragActive,
                  "bg-danger/30 border-danger border-solid cursor-no-drop":
                    isDragReject,
                }
              ),
            })}
          >
            <input {...getInputProps()} />
            <CloudUpload
              className={cn("w-24 h-24 text-neutral-600/70 transition-colors", {
                "text-main": isDragActive,
                "text-danger": isDragReject,
              })}
            />

            <div
              className={cn("flex flex-col items-center", {
                "text-danger": isDragReject,
              })}
            >
              <div>
                {isDragActive
                  ? isDragReject
                    ? "Only one pdf file is accepted"
                    : "Drop the file here"
                  : "Drag and drop your document here"}
              </div>

              <div className="text-neutral-400 text-sm">
                {isDragActive ? "⠀" : "- or -"}
              </div>
              <div
                className={cn("text-main text-sm", {
                  "text-danger": isDragReject,
                })}
              >
                {isDragActive ? "⠀" : "Browse file"}
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between items-center w-full flex-row">
          <DialogClose asChild>
            <button
              type="button"
              className="bg-neutral-900 rounded-lg py-2 px-3 text-sm grid place-content-center text-neutral-200 border border-neutral-600 hover:bg-neutral-800 duration-200 disabled:pointer-events-none disabled:opacity-50"
              disabled={isUploading || isCreating}
            >
              Close
            </button>
          </DialogClose>

          {isCreating ? (
            <div className="text-neutral-400 text-sm flex gap-1 items-center">
              Creating chat <Loader className="animate-spin w-4 h-4" />
            </div>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
