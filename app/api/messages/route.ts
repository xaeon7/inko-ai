import {
  type ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
} from "openai-edge";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";
import { getContext } from "@/lib/context";
import { db } from "@/lib/db";
import { chats, messages as _messages } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "edge";

const config = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(config);

export type ChatRequest = {
  messages: ChatCompletionRequestMessage[];
  chatId: string;
};

export async function POST(req: Request) {
  try {
    const { messages, chatId } = (await req.json()) as ChatRequest;
    const _chats = await db.select().from(chats).where(eq(chats.id, chatId));

    if (!_chats.length) {
      return NextResponse.json({ error: "chat not found" }, { status: 403 });
    }

    const lastMessage = messages[messages.length - 1];

    if (!lastMessage.content) {
      return NextResponse.json({ error: "empty content" }, { status: 403 });
    }

    if (lastMessage.content.length > 3000) {
      return NextResponse.json({ error: "too long" }, { status: 403 });
    }

    const context = await getContext(lastMessage.content, _chats[0].file_key);

    const prompt = {
      role: "system",
      content: `InkoAI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      InkoAI is a well-behaved and well-mannered individual.
      InkoAI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      InkoAI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      InkoAI assistant will always answer using markdown.
      InkoAI assistant will always mention the page number.
      All links are included in markdown format.
      If the context does not provide the answer to question, the InkoAI assistant will say, "I'm sorry, but I don't know the answer to that question".
      InkoAI assistant will not apologize for previous responses, but instead will indicated new information was gained.
      InkoAI assistant will not invent anything that is not drawn directly from the context.
      `,
    } satisfies ChatCompletionRequestMessage;

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-16k",
      // model: "gpt-3.5-turbo",
      temperature: 0,
      stream: true,
      messages: [
        prompt,
        ...messages.filter((message) => message.role === "user"),
      ],
    });

    if (response.status != 200) {
      return NextResponse.json("Internal server error", {
        status: response.status,
      });
    }

    const stream = OpenAIStream(response, {
      onStart: async () => {
        await db
          .insert(_messages)
          .values({ chatId, content: lastMessage.content ?? "", role: "user" });
      },
      onCompletion: async (completion) => {
        await db.insert(_messages).values({
          chatId,
          content: completion,
          role: "system",
        });
      },
    });

    return new StreamingTextResponse(stream);
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
