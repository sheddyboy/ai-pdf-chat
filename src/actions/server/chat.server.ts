"use server";
import db from "@/db";
import { createClient } from "@/lib/supabase/server";
import { Chats } from "@/schemas";
import { desc, eq } from "drizzle-orm";

export async function createChat({
  userId,
  pdfUrl,
  pdfName,
  pineconeNamespace,
}: {
  userId: string;
  pdfUrl: string;
  pdfName: string;
  pineconeNamespace: string;
}) {
  try {
    const [data] = await db
      .insert(Chats)
      .values({
        userId,
        pdfUrl,
        pdfName,
        pineconeNamespace,
      })
      .returning();
    return data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

export async function getChats() {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.auth.getUser();
    // if (error) {
    //   throw new Error(error.message);
    // }
    if (data.user) {
      return await db
        .select()
        .from(Chats)
        .where(eq(Chats.userId, data.user.id))
        .orderBy(desc(Chats.updatedAt));
    } else {
      return [];
    }
  } catch (error) {
    return [];
    // throw new Error((error as Error).message);
  }
}
export async function getChat(chatId: string) {
  try {
    const [chat] = await db.select().from(Chats).where(eq(Chats.id, +chatId));
    if (!chat) throw new Error("No chat found");
    return chat;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
