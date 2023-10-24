import { db } from "@/lib/db";
import { chats, messages } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type RouteContext = {
  params: {
    chatId: string;
  };
};

export async function GET(req: Request, context: RouteContext) {
  const { params } = context;

  if (!params.chatId) {
    return NextResponse.json(null, { status: 500 });
  }

  if (!(await verifyCurrentUserHasAccessToChat(params.chatId))) {
    return new Response(null, { status: 403 });
  }

  try {
    const _messages = await db
      .select()
      .from(messages)
      .where(eq(messages.chatId, params.chatId));

    return NextResponse.json(_messages, { status: 200 });
  } catch (error) {
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
