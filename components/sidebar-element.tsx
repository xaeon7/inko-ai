"use client";

import { type Chat } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { Document } from "@/components/icons/document";
import { Rename } from "./icons/rename";
import { Delete } from "./icons/delete";
import { Check } from "./icons/check";
import { X } from "./icons/x";
import { Input } from "./ui/input";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import newToast from "@/lib/toast";
import { Loader } from "./icons/loader";
import { useRouter } from "next/navigation";

type SidebarElementProps = {
  chat: Chat;
  isActive?: boolean;
};

export default function SidebarElement({
  chat,
  isActive,
}: SidebarElementProps) {
  const [isEditMode, setIsEditMode] = React.useState(false);
  const [pdfName, setPdfName] = React.useState(chat.pdfName);
  const [isUpdating, setIsUpdating] = React.useState(false);
  const router = useRouter();

  const { mutate: updateTitle } = useMutation({
    mutationFn: async ({ chat }: { chat: Chat }) => {
      await axios.patch(`/api/chats/${chat.id}`, { chat });
    },
    onMutate: () => {
      setIsUpdating(true);
    },
    onSuccess: () => {
      newToast("Chat name updated successfully");
      router.refresh();
    },
    onError: (err) => {
      console.log(err);
      newToast("Error occurred while updating chat name", "error");
    },
    onSettled: () => {
      setIsUpdating(false);
      setIsEditMode(false);
    },
  });

  const { mutate: deleteChat } = useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/chats/${chat.id}`);
    },
    onMutate: () => {
      setIsUpdating(true);
    },
    onSuccess: () => {
      newToast("Chat deleted successfully");
      router.push("/chat");
    },
    onError: () => {
      newToast("Error occurred while deleting chat", "error");
    },
    onSettled: () => {
      setIsUpdating(false);
    },
  });

  function handleSubmit() {
    if (pdfName.length > 3 && pdfName !== chat.pdfName) {
      updateTitle({ chat: { ...chat, pdfName } });
    } else if (pdfName === chat.pdfName) {
      newToast("Chat name cannot be changes to the same name", "error");
      setIsEditMode(false);
    } else {
      newToast("Chat name cannot be less than 3 characters", "error");
    }
  }

  return (
    <Link
      href={`/chat/${chat.id}`}
      className={cn(
        "flex gap-2 items-center text-sm border transition-all p-3 border-transparent rounded-lg text-neutral-400 select-none",
        {
          "text-main bg-main/20 border-main hover:bg-main/30": isActive,
          "hover:bg-neutral-600/40 py-3.5": !isActive,
          "animate-pulse": isUpdating,
        }
      )}
      onClick={(e) => e.stopPropagation()}
      draggable={false}
    >
      <Document className="min-w-[16px] w-4" />
      {isActive && isEditMode && !isUpdating ? (
        <Input
          className="h-6 text-sm z-10 rounded-md px-2"
          value={pdfName}
          minLength={3}
          maxLength={50}
          onChange={(e) => setPdfName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit();
            }
          }}
        />
      ) : (
        <span className="w-full whitespace-nowrap overflow-hidden text-ellipsis">
          {isUpdating ? pdfName : chat.pdfName}
        </span>
      )}

      {isActive && !isUpdating ? (
        !isEditMode ? (
          <button
            onClick={() => setIsEditMode(true)}
            className="min-w-[16px] w-6 h-6 hover:text-main-500 duration-200 cursor-pointer"
          >
            <Rename />
          </button>
        ) : (
          <button
            className="w-6 h-6 hover:text-main-500 duration-200 cursor-pointer"
            onClick={handleSubmit}
          >
            <Check className="w-4 h-4" />
          </button>
        )
      ) : null}
      {isActive && !isUpdating ? (
        !isEditMode ? (
          <button
            className="w-6 h-6 hover:text-danger duration-200 cursor-pointer"
            onClick={() => deleteChat()}
          >
            <Delete />
          </button>
        ) : (
          <button
            onClick={() => setIsEditMode(false)}
            className="min-w-[16px] w-6 h-6 hover:text-danger duration-200 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )
      ) : null}

      {isUpdating ? <Loader className="w-6 h-6 animate-spin" /> : null}
    </Link>
  );
}
