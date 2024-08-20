import { NextRequest, NextResponse } from "next/server";
import { Message, OpenAIStream, StreamingTextResponse } from "ai";
import openai from "@/lib/openai";
import { getRelevantContextFromPinecone } from "@/lib/pinecone";
import { createMessage } from "@/actions/server/messages.server";

// export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const {
      messages,
      pineconeNamespace,
      chatId,
    }: {
      messages: { content: string; role: "user" | "assistant" }[];
      pineconeNamespace: string;
      chatId: string;
    } = await req.json();

    const userMessages = messages
      .map(({ content, role }) => ({
        content,
        role,
      }))
      .filter(({ role }) => role === "user");
    const latestMessage = messages.at(-1);

    if (!latestMessage) {
      throw new Error("No message found");
    }

    const context = await getRelevantContextFromPinecone({
      query: latestMessage.content,
      namespace: pineconeNamespace,
    });

    const prompt = `AI assistant is a brand new, powerful, human-like artificial intelligence.
      The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
      AI is a well-behaved and well-mannered individual.
      AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
      AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.
      AI assistant is a big fan of Pinecone and Vercel.
      START CONTEXT BLOCK
      ${context}
      END OF CONTEXT BLOCK
      AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
      If the context does not provide the answer to question, the AI assistant will say, "I'm sorry, but I don't know the answer to that question".
      AI assistant will not apologize for previous responses, but instead will indicated new information was gained.
      AI assistant will not invent anything that is not drawn directly from the context.`;

    const res = await openai.createChatCompletion({
      messages: [{ role: "system", content: prompt }, ...userMessages],
      model: "gpt-3.5-turbo",
      stream: true,
      max_tokens: 100,
    });
    const stream = OpenAIStream(res, {
      onStart: async () => {
        try {
          await createMessage({
            chatId: +chatId,
            content: latestMessage.content,
            role: "user",
          });
        } catch (error) {
          throw new Error((error as Error).message);
        }
      },
      onCompletion: async (content) => {
        try {
          await createMessage({
            chatId: +chatId,
            content,
            role: "assistant",
          });
        } catch (error) {
          throw new Error((error as Error).message);
        }
      },
    });
    return new StreamingTextResponse(stream);
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
