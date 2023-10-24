"use client";

import { cn } from "@/lib/utils";
import React from "react";
import { useUser } from "@clerk/nextjs";
import { type Message } from "ai/react";
import Image from "next/image";
import AssistantPFP from "@/public/assistant_profile.jpg";
import Markdown from "react-markdown";

type MessagesListProps = { messages: Message[] };

export default function MessagesList({ messages }: MessagesListProps) {
  const { user } = useUser();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
  }, [messages]);

  return (
    <div className="flex flex-col gap-3 w-full overflow-y-scroll pr-4">
      {messages.map((message) => {
        const isUser = message.role === "user";
        return (
          <div
            key={message.id}
            className={cn("flex gap-2 items-end", {
              "justify-end pl-10 ml-auto flex-row-reverse": isUser,
              "justify-start pr-10": !isUser,
            })}
          >
            <Image
              src={isUser ? user?.imageUrl ?? "" : AssistantPFP.src}
              className="w-8 h-8 rounded-full bg-neutral-600"
              width={32}
              height={32}
              alt="profile"
            />

            <div
              className={cn("py-2 px-3 rounded-lg w-fit", {
                "bg-main rounded-br-none": isUser,
                "bg-neutral-600 rounded-bl-none": !isUser,
              })}
            >
              <Markdown
                className={cn("prose-sm prose-invert", {
                  "text-neutral-50": isUser,
                })}
              >
                {message.content}
              </Markdown>
            </div>
          </div>
        );
      })}

      {/* {messages[messages.length - 1].role !== "user" ? (
        <button className="text-xs ml-10 border border-neutral-600 text-neutral-400 py-2 px-3 w-fit rounded-lg hover:bg-neutral-800 bg-transparent">
          Regenerate
        </button>
      ) : null} */}
      <div ref={messagesEndRef} />
    </div>
  );
}
