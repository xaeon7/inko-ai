import { db } from "@/lib/db";
import { type Chat, chats, messages } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type RouteContext = {
  params: {
    chatId: string;
  };
};

export async function DELETE(req: Request, context: RouteContext) {
  const { params } = context;

  if (!params.chatId) {
    return NextResponse.json(null, { status: 500 });
  }

  if (!(await verifyCurrentUserHasAccessToChat(params.chatId))) {
    return new Response(null, { status: 403 });
  }

  try {
    await db.delete(messages).where(eq(messages.chatId, params.chatId));
    await db.delete(chats).where(eq(chats.id, params.chatId));
    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    return NextResponse.json(null, { status: 500 });
  }
}

export type PatchRequest = {
  chat: Chat;
};

export async function PATCH(req: Request, context: RouteContext) {
  const { params } = context;

  if (!params.chatId) {
    return NextResponse.json(null, { status: 500 });
  }

  if (!(await verifyCurrentUserHasAccessToChat(params.chatId))) {
    return new Response(null, { status: 403 });
  }

  try {
    const { chat } = (await req.json()) as PatchRequest;

    if (!chat.id) {
      return NextResponse.json(null, { status: 401 });
    }

    await db
      .update(chats)
      .set({ pdfName: chat.pdfName, updatedAt: new Date() })
      .where(eq(chats.id, params.chatId));

    return NextResponse.json(null, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(null, { status: 500 });
  }
}

async function verifyCurrentUserHasAccessToChat(chatId: string) {
  const { userId } = auth();
  if (!userId) return false;

  const chat = await db
    .select()
    .from(chats)
    .where(eq(chats.userId, userId))
    .where(eq(chats.id, chatId));

  const count = chat.length;

  return count > 0;
}