"use server";
import db from "@/db";
import { Messages, UserSystemEnum } from "@/schemas";
import { eq } from "drizzle-orm";
import { getChat } from "@/actions/server/chat.server";

export async function getMessages(chatId: string) {
  try {
    const chat = await getChat(chatId);
    const messages = await db.query.Messages.findMany({
      where: eq(Messages.chatId, +chatId),
    });
    return { messages, chat };
  } catch (error) {
    console.log("getMessagesError");
    throw new Error((error as Error).message);
  }
}

export async function createMessage({
  content,
  role,
  chatId,
}: {
  content: string;
  chatId: number;
  role: (typeof UserSystemEnum.enumValues)[number];
}) {
  try {
    const [message] = await db
      .insert(Messages)
      .values({
        chatId,
        content,
        role,
      })
      .returning();

    return message;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
