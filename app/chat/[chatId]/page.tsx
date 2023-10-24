import Chat from "@/components/chat";
import PDFViewer from "@/components/new-pdf-viewer";
import Sidebar from "@/components/sidebar";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import { type Metadata } from "next";
import { redirect } from "next/navigation";

type Props = {
  params: {
    chatId: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = params.chatId;
  const chat = await db.select().from(chats).where(eq(chats.id, id));

  return {
    title: chat[0]?.pdfName ?? "Chat",
  };
}

export default async function ChatPage({ params }: Props) {
  const { userId } = auth();
  if (!userId) return redirect("/sign-in");
  const _chats = await db
    .select()
    .from(chats)
    .where(eq(chats.userId, userId))
    .orderBy(desc(chats.createdAt));
  const currentChat = _chats.find((chat) => chat.id == params.chatId);

  if (!currentChat) return redirect("/chat");
  const pdfUrl = currentChat?.pdfUrl ?? "";

  return (
    <main className="h-full w-full flex">
      <div className="w-1/6 min-w-[250px] border-r border-neutral-600">
        <Sidebar chats={_chats} currentChatId={currentChat?.id} />
      </div>

      <div className="w-3/6">
        <PDFViewer pdfUrl={pdfUrl} />
      </div>

      <div className="w-2/6 min-w-[300px] border-l border-neutral-600">
        {currentChat?.id ? <Chat chatId={currentChat?.id} /> : <></>}
      </div>
    </main>
  );
}
