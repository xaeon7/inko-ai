import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { loadS3ToPinecone } from "@/lib/pinecone";
import { getS3Url } from "@/lib/s3";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export type CreateChatRequest = {
  file_key: string;
  file_name: string;
};

export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = (await req.json()) as CreateChatRequest;
    const { file_key, file_name } = body;
    await loadS3ToPinecone(file_key);

    const chat_id = await db
      .insert(chats)
      .values({
        file_key: file_key,
        pdfName: file_name,
        pdfUrl: getS3Url(file_key),
        userId,
      })
      .returning({
        insertedId: chats.id,
      });

    return NextResponse.json(
      { chat_id: chat_id[0].insertedId },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
