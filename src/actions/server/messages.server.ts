"use server";
import db from "@/db";
import { Messages, UserSystemEnum } from "@/schemas";
import { eq } from "drizzle-orm";
import { getChat } from "@/actions/server/chat.server";

export async function getMessages(chatId: string) {
  try {
    const { data: chat, error } = await getChat(chatId);
    if (error !== null) {
      return { data: null, error };
    }
    const messages = await db.query.Messages.findMany({
      where: eq(Messages.chatId, +chatId),
    });
    return { data: { messages, chat }, error: null };
  } catch (error) {
    console.log("getMessagesError");
    return { data: null, error: new Error((error as Error).message).message };
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

    return { data: message, error: null };
  } catch (error) {
    return { data: null, error: new Error((error as Error).message).message };
  }
}
