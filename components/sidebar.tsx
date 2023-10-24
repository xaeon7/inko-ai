"use client";

// import { Collapse } from "@/components/icons/collapse-sidebar";
import UploadDialog from "@/components/upload-dialog";
import { UserButton, useUser } from "@clerk/nextjs";
import { type Chat } from "@/lib/db/schema";
import SidebarElement from "./sidebar-element";
import Link from "next/link";

type SidebarProps = {
  chats: Chat[];
  currentChatId?: string;
};

export default function Sidebar({ chats, currentChatId }: SidebarProps) {
  const { isLoaded } = useUser();
  return (
    <div className="w-full h-full flex flex-col gap-8 py-6">
      {/* Menu */}
      <div className="flex justify-between items-center px-4">
        {isLoaded ? (
          <UserButton />
        ) : (
          <div className="w-8 h-8 rounded-full bg-neutral-600 animate-pulse" />
        )}

        {/* Options */}
        <div className="flex gap-1">
          <UploadDialog />

          {/* <button
            disabled
            className="bg-neutral-900 rounded-lg w-8 h-8 grid place-content-center text-neutral-600 border border-neutral-600 hover:bg-neutral-800 duration-200 disabled:opacity-50 disabled:pointer-events-none"
          >
            <Collapse />
          </button> */}
        </div>
      </div>

      <div className="flex flex-col overflow-y-auto px-3">
        {chats.map((chat) => (
          <SidebarElement
            key={chat.id}
            chat={chat}
            isActive={currentChatId === chat.id}
          />
        ))}
      </div>

      <footer className="text-[10px] text-neutral-200 mx-auto mt-auto px-3">
        Developed by{" "}
        <Link
          href="https://github.com/aalaeDev"
          className="underline duration-200 hover:text-neutral-100"
        >
          aalaedev
        </Link>
        . The source code is on{" "}
        <Link
          href="https://github.com/aalaeDev/inko-ai"
          className="underline duration-200 hover:text-neutral-100"
        >
          GitHub
        </Link>
        .
      </footer>
    </div>
  );
}
