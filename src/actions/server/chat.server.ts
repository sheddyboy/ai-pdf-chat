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
    return { data, error: null };
  } catch (error) {
    return { data: null, error: new Error((error as Error).message).message };
  }
}

export async function getChats() {
  try {
    const supabase = createClient();
    const { data: userData, error } = await supabase.auth.getUser();
    if (error) {
      return { data: null, error: error.message };
    }

    const data = await db
      .select()
      .from(Chats)
      .where(eq(Chats.userId, userData.user.id))
      .orderBy(desc(Chats.updatedAt));

    return { data, error: null };
  } catch (error) {
    return { data: null, error: new Error((error as Error).message).message };
  }
}
export async function getChat(chatId: string) {
  try {
    const [chat] = await db.select().from(Chats).where(eq(Chats.id, +chatId));
    if (!chat) {
      return { data: null, error: "No Chat found" };
    }
    return { data: chat, error: null };
  } catch (error) {
    return { data: null, error: new Error((error as Error).message).message };
  }
}
