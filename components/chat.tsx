"use client";

import { useChat } from "ai/react";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "@/components/icons/send";
import { cn } from "@/lib/utils";
import MessagesList from "./messages-list";
import { Loader } from "./icons/loader";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { type Message } from "ai";

type ChatProps = {
  chatId: string;
};

export default function Chat({ chatId }: ChatProps) {
  const { data } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const response = await axios.get<Message[]>(`/api/messages/${chatId}`);
      return response.data;
    },
  });

  const [lastMessage, setLastMessage] = React.useState("");

  const { input, setInput, handleSubmit, messages, isLoading, error } = useChat(
    {
      api: "/api/messages",
      body: {
        chatId,
      },
      initialMessages: data ?? [],
      onError() {
        setInput(lastMessage);
      },
    }
  );

  const [isClient, setIsClient] = React.useState(false);
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;
  return (
    <div className="relative flex flex-col h-screen max-h-screen overflow-hidden">
      <div className="sticky z-10 top-0 inset-x-0 p-3 bg-gradient-to-b from-neutral-900 to-neutral-900/0 grid place-content-center">
        <h3 className="text-xl font-bold text-neutral-400 select-none">
          InkoAI
        </h3>
      </div>

      <div className="flex flex-col h-full overflow-hidden justify-end px-3 scroll-smooth">
        {messages.length > 0 ? <MessagesList messages={messages} /> : <></>}
      </div>

      <form
        className="sticky bottom-0 inset-x-0 z-10 p-3 bg-gradient-to-t from-neutral-900 to-neutral-900/0"
        onSubmit={handleSubmit}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            handleSubmit(e);
          }
        }}
      >
        {error ? (
          <div className="flex items-center gap-1 p-3 mb-2 border text-sm border-danger text-danger bg-danger/20 rounded-lg">
            Something went wrong. Please{" "}
            <button
              type={isLoading ? "button" : "submit"}
              className="underline"
            >
              try again.
            </button>
            {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <></>}
          </div>
        ) : null}

        <div className="relative">
          <button
            type="submit"
            className={cn(
              "text-main absolute right-4 top-1/2 -translate-y-1/2 duration-200 hover:bg-opacity-95 hover:shadow-2xl hover:shadow-main disabled:cursor-not-allowed disabled:opacity-50"
            )}
            disabled={input.length <= 0 || isLoading}
          >
            {isLoading ? <Loader className="animate-spin" /> : <Send />}
          </button>

          <Textarea
            name="prompt"
            placeholder={
              !isLoading ? "Ask Inko something ✨" : "Inko is thinking..."
            }
            minRows={1}
            maxRows={6}
            minLength={1}
            maxLength={1000}
            className="resize-none pr-10 py-3"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setLastMessage(e.target.value);
            }}
            autoFocus
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
              }
            }}
          />
        </div>
      </form>
    </div>
  );
}
