import SidebarElement from "@/components/sidebar-element";
import UploadDialog from "@/components/upload-dialog";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { type Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Chats",
};

export default async function ChatPage() {
  const { userId } = auth();
  if (!userId) return redirect("/sign-in");

  const _chats = await db
    .select()
    .from(chats)
    .limit(12)
    .where(eq(chats.userId, userId));
  return (
    <div className="flex w-full h-full flex-col gap-6 items-center justify-center">
      <div className="flex gap-3 items-center">
        <Link
          href="/"
          className="text-3xl font-bold text-neutral-400 select-none"
        >
          InkoAI
        </Link>
        <UploadDialog />
      </div>

      <div className="border border-neutral-600 rounded-lg grid grid-cols-3 gap-2 p-2">
        {_chats.length > 0 ? (
          _chats.map((chat) => <SidebarElement chat={chat} key={chat.id} />)
        ) : (
          <div className="text-xs text-neutral-400">There are no chats.</div>
        )}
      </div>

      <footer className="fixed bottom-0 text-xs text-neutral-200 mx-auto pb-6">
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
